import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { SchoolDto } from '../../src/training/school/interface/school-dto';
import { plainToClass } from 'class-transformer';
import { removeIds } from '../utils/snapshot-utils';
import { EnrollmentWriteDto } from '../../src/training/enrollment/interface/enrollment-write-dto';
import { EnrollmentType } from '../../src/training/enrollment/enrollment-type';
import { TandemSchoolPaymentState } from '../../src/flight/tandem-school-payment-state';

describe('Schools (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/schools (POST)', async () => {
    // given
    const schoolDto = Testdata.createSchoolDto("School 1");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(schoolDto)
      .expect(201)
      .then(async (response) => {
        await assertSchool(testInstance, response.body, schoolDto);
      });
  });

  it('/schools already exists (POST)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);

    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(Testdata.createSchoolDto("School 1"))
      .expect(409)
      .then(async (response) => {
        expect(response.body.message).toEqual('The school already exists.');
      });
  });

  it('/schools/configuration (PUT)', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();
    expect(school.configuration).toEqual({
      schoolModule: {
        active: true,
        validateFlights: true,
        userCanEditControlSheet: true,
      },
      tandemModule: {
        active: true
      }
    });

    school.configuration = {
      schoolModule: {
        active: false,
        validateFlights: false,
        userCanEditControlSheet: false,
      },
      tandemModule: {
        active: false
      }
    };

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/schools/${school.id}/configuration`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(school.configuration)
      .expect(200)
      .then(async (response) => {
        await assertSchool(testInstance, response.body, plainToClass(SchoolDto, school));
      });
  });

  it('/schools/:id/google-calendar/status (GET) - not connected', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${school.id}/google-calendar/status`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual({ connected: false });
      });
  });

  it('/schools/:id/google-calendar/status (GET) - connected', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    school.configuration = {
      ...school.configuration,
      googleCalendar: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        calendarId: 'primary',
        tokenExpiry: new Date(Date.now() + 3600000)
      }
    };
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${school.id}/google-calendar/status`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual({ connected: true });
      });
  });

  it('/schools/:id/google-calendar/auth (GET) - get auth URL', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${school.id}/google-calendar/auth`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.authUrl).toBeDefined();
        expect(response.body.authUrl).toBe(`https://mock-google-auth-url.com?state=${school.id}`);
      });
  });

  it('/schools/:id/google-calendar/disconnect (DELETE) - disconnect connected calendar', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    school.configuration = {
      ...school.configuration,
      googleCalendar: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        calendarId: 'primary',
        tokenExpiry: new Date(Date.now() + 3600000)
      }
    };
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    await request(testInstance.app.getHttpServer())
      .delete(`/schools/${school.id}/google-calendar/disconnect`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204);

    // then - verify calendar is disconnected
    const updatedSchool = await testInstance.schoolRepository.findOne({
      where: { id: school.id }
    });
    expect(updatedSchool.configuration.googleCalendar).toBeNull();
  });

  it('/schools/:id/google-calendar/disconnect (DELETE) - disconnect when not connected', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    await request(testInstance.app.getHttpServer())
      .delete(`/schools/${school.id}/google-calendar/disconnect`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204);

    // then - verify school still exists and googleCalendar is set to null
    const updatedSchool = await testInstance.schoolRepository.findOne({
      where: { id: school.id }
    });
    expect(updatedSchool).toBeDefined();
    expect(updatedSchool.configuration.googleCalendar).toBeNull();
  });

  it('/schools/:id/google-calendar/calendars (GET) - not configured', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${school.id}/google-calendar/calendars`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toContain('Google Calendar not configured');
      });
  });

  it('/schools/:id/google-calendar/calendars (GET) - success', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    school.configuration = {
      ...school.configuration,
      googleCalendar: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        calendarId: 'primary',
        tokenExpiry: new Date(Date.now() + 3600000)
      }
    };
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${school.id}/google-calendar/calendars`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(3);
        expect(response.body).toMatchSnapshot();
      });
  });

  it('/schools/:id/google-calendar/calendar (PUT) - not configured', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/schools/${school.id}/google-calendar/calendar`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send({ calendarId: 'calendar-2' })
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toContain('Google Calendar not configured');
      });
  });

  it('/schools/:id/google-calendar/calendar (PUT) - success', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    school.configuration = {
      ...school.configuration,
      googleCalendar: {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        calendarId: 'primary',
        tokenExpiry: new Date(Date.now() + 3600000)
      }
    };
    await testInstance.schoolRepository.save(school);
    const teamMember = Testdata.createTeamMember(school, await testInstance.getDefaultUser(), true);
    await testInstance.teamMemberRepository.save(teamMember);
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    await request(testInstance.app.getHttpServer())
      .put(`/schools/${school.id}/google-calendar/calendar`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send({ calendarId: 'calendar-2' })
      .expect(204);

    // then - verify calendar ID was updated
    const updatedSchool = await testInstance.schoolRepository.findOne({
      where: { id: school.id }
    });
    expect(updatedSchool.configuration.googleCalendar.calendarId).toBe('calendar-2');
  });

  it('/schools/google-calendar/callback (GET) - with error', async () => {
    //when
    return request(testInstance.app.getHttpServer())
      .get('/schools/google-calendar/callback')
      .query({ 
        error: 'access_denied',
        state: JSON.stringify({ schoolId: 1 })
      })
      .expect(302)
      .then(async (response) => {
        expect(response.headers.location).toBe('https://instructor.test.com/configuration?google_calendar=error&message=access_denied&school=1');
      });
  });

  it('/schools/google-calendar/callback (GET) - missing code', async () => {
    //when
    return request(testInstance.app.getHttpServer())
      .get('/schools/google-calendar/callback')
      .query({ state: JSON.stringify({ schoolId: 1 }) })
      .expect(302)
      .then(async (response) => {
        expect(response.headers.location).toBe('https://instructor.test.com/configuration?google_calendar=error&message=no_code_or_state&school=1');
      });
  });

  it('/schools/google-calendar/callback (GET) - missing state', async () => {
    //when
    return request(testInstance.app.getHttpServer())
      .get('/schools/google-calendar/callback')
      .query({ code: 'test-code' })
      .expect(302)
      .then(async (response) => {
        expect(response.headers.location).toBe('https://instructor.test.com/configuration?google_calendar=error&message=no_code_or_state');
      });
  });

  it('/schools/google-calendar/callback (GET) - success', async () => {
    // given
    const school = Testdata.createSchool("School 1");
    await testInstance.schoolRepository.save(school);

    //when
    await request(testInstance.app.getHttpServer())
      .get('/schools/google-calendar/callback')
      .query({
        code: 'test-authorization-code',
        state: JSON.stringify({ schoolId: school.id })
      })
      .expect(302)
      .then(async (response) => {
        expect(response.headers.location).toBe(`https://instructor.test.com/configuration?google_calendar=success&school=${school.id}`);
      });

    // then - verify Google Calendar was configured
    const updatedSchool = await testInstance.schoolRepository.findOne({
      where: { id: school.id }
    });
    expect(updatedSchool.configuration.googleCalendar).toBeDefined();
    expect(updatedSchool.configuration.googleCalendar).toMatchSnapshot({
      tokenExpiry: expect.any(String)
    });
  });
});

describe('Schools tandem pilots (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/schools/:id/tandem-pilots/enrollment (POST)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolData();
    const enrollmentDto: EnrollmentWriteDto = {
      email: Testdata.EMAIL
    };

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .post(`/schools/${testSchool.id}/tandem-pilots/enrollment`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(enrollmentDto)
      .expect(204)
      .then(async () => {
        const db = await testInstance.enrollmentRepository.find();
        expect(db).toHaveLength(1);
        expect(db[0].email).toBe(enrollmentDto.email);
        expect(db[0].type).toBe(EnrollmentType.TANDEM_PILOT);
        expect(db[0].isFree).toBeFalsy();
      });
  });

  it('/schools/:id/tandem-pilots (GET)', async () => {
    // given
    const { instructorUser, testSchool } = await testInstance.createSchoolData();

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${testSchool.id}/tandem-pilots`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body)).toMatchSnapshot();
      });
  });

  it('/schools/:id/tandem-pilots/:tandemPilotId (DELETE)', async () => {
    // given
    const { instructorUser, testSchool, tandemPilot } = await testInstance.createSchoolData();
    expect(tandemPilot.isArchived).toBe(false);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/schools/${testSchool.id}/tandem-pilots/${tandemPilot.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.tandemPilotRepository.findOne({
          where: { id: tandemPilot.id }
        });
        expect(db.isArchived).toBe(true);
      });
  });

  it('/schools/:id/tandem-pilots/:tandemPilotId/passenger-confirmations (GET)', async () => {
    // given
    const { instructorUser, testSchool, tandemPilot } = await testInstance.createSchoolData();
    const passengerConfirmation = Testdata.createPassengerConfirmation(testSchool, tandemPilot.user);
    await testInstance.passengerConfirmationRepository.save(passengerConfirmation);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    // when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${testSchool.id}/tandem-pilots/${tandemPilot.id}/passenger-confirmations`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body.entity).toHaveLength(1);
        expect(removeIds(response.body.entity)).toMatchSnapshot();
      });
  });

  it('/schools/:id/tandem-pilots/:tandemPilotId/flights (GET)', async () => {
    // given
    const { instructorUser, testSchool, tandemPilot } = await testInstance.createSchoolData();
    const flights = await testInstance.createFlightData(tandemPilot.user, testSchool);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    // when
    return request(testInstance.app.getHttpServer())
      .get(`/schools/${testSchool.id}/tandem-pilots/${tandemPilot.id}/flights`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(response => {
        expect(response.body.entity).toHaveLength(flights.length);
        expect(removeIds(response.body.entity)).toMatchSnapshot();
      });
  });

  it('/schools/:id/tandem-pilots/:tandemPilotId/flights/:flightId (PUT)', async () => {
    // given
    const { instructorUser, testSchool, tandemPilot } = await testInstance.createSchoolData();
    const flights = await testInstance.createFlightData(tandemPilot.user, testSchool);
    const flightTandemSchoolData = {
      paymentState: TandemSchoolPaymentState.PAID,
      paymentComment: 'paid',
      instructor: instructorUser,
      tandemSchool: testSchool,
      paymentAmount: 100
    };

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    // when
    return request(testInstance.app.getHttpServer())
      .put(`/schools/${testSchool.id}/tandem-pilots/${tandemPilot.id}/flights/${flights[0].id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(flightTandemSchoolData)
      .expect(200)
      .then(response => {
        expect(removeIds(response.body)).toMatchSnapshot({
          tandemSchoolData: {
            paymentTimestamp: expect.any(String)
          }
        });
      });
  });
});

describe('Student schools (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/student/schools (GET)', async () => {
    // given
    const { studentUser } = await testInstance.createSchoolData();

    // Create a second school
    await testInstance.createSchoolData("student2@student.com", "instructor2@instructor.com", "School 2", "tandem-pilot2@tandem-pilot.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: studentUser.id, email: studentUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/student/schools`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(1);
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.schoolRepository.find();

        expect(db).toHaveLength(2);
      });
  });

  it('/student/schools/:id (DELETE)', async () => {
    // given
    const { student } = await testInstance.createSchoolData();
    expect(student.isArchived).toBe(false);

    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: student.user.id, email: student.user.email });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/student/schools/${student.school.id}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.studentRepository.findOne({
          where: { id: student.id }
        });
        expect(db.isArchived).toBe(true);
        expect(db.isAppointmentActive).toBe(false);
      });
  });
});

describe('instructor schools (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/instructor/schools (GET)', async () => {
    // given
    const { instructorUser } = await testInstance.createSchoolData();

    // Create a second school
    const { testSchool } = await testInstance.createSchoolData("student2@student.com", "instructor2@instructor.com", "School 2", "tandem-pilot2@tandem-pilot.com");
    await testInstance.teamMemberRepository.save(Testdata.createTeamMember(testSchool, instructorUser, true));
    const keycloakToken = JwtTestHelper.createKeycloakToken({ sub: instructorUser.id, email: instructorUser.email });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/instructor/schools`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toHaveLength(2);
        expect(removeIds(response.body)).toMatchSnapshot();

        const db = await testInstance.schoolRepository.find();

        expect(db).toHaveLength(2);
      });
  });
});

async function assertSchool(testInstance: any, received: any, expected: SchoolDto) {
  expect(removeIds(received)).toMatchSnapshot();
  expect(received.id).toBeDefined();

  const db = await testInstance.schoolRepository.findOne({
    where: { name: received.name }
  });
  expect(removeIds(db)).toMatchSnapshot();
  expect(db.id).toEqual(received.id);
}