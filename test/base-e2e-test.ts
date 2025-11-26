import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { DataSource, Not, Repository } from 'typeorm';
import { News } from '../src/news/news.entity';
import { User } from '../src/user/domain/user.entity';
import { Testdata } from './testdata';
import { AppointmentBuilderTest } from './utils/appointment-builder-test';
import { School } from '../src/training/school/school.entity';
import { Student } from '../src/training/student/student.entity';
import { Appointment } from '../src/training/appointment/appointment.entity';
import { TeamMember } from '../src/training/team-member/team-member.entity';

export class BaseE2ETest {
  public get app(): INestApplication {
    return (global as any).testApp;
  }

  public get moduleFixture(): TestingModule {
    return (global as any).testModuleFixture;
  }

  public get dataSource(): DataSource {
    return (global as any).testDataSource;
  }

  public get userRepository(): Repository<any> {
    return (global as any).testUserRepository;
  }

  public get newsRepository(): Repository<News> {
    return (global as any).testNewsRepository;
  }

  public get placeRepository(): Repository<any> {
    return (global as any).testPlaceRepository;
  }

  public get gliderRepository(): Repository<any> {
    return (global as any).testGliderRepository;
  }

  public get controlSheetRepository(): Repository<any> {
    return (global as any).testControlSheetRepository;
  }

  public get flightRepository(): Repository<any> {
    return (global as any).testFlightRepository;
  }

  public get schoolRepository(): Repository<any> {
    return (global as any).testSchoolRepository;
  }

  public get teamMemberRepository(): Repository<any> {
    return (global as any).testTeamMemberRepository;
  }

  public get enrollmentRepository(): Repository<any> {
    return (global as any).testEnrollmentRepository;
  }

  public get studentRepository(): Repository<any> {
    return (global as any).testStudentRepository;
  }

  public get noteRepository(): Repository<any> {
    return (global as any).testNoteRepository;
  }

  public get emergencyContactRepository(): Repository<any> {
    return (global as any).testEmergencyContactRepository;
  }

  public get appointmentTypeRepository(): Repository<any> {
    return (global as any).testAppointmentTypeRepository;
  }

  public get appointmentRepository(): Repository<any> {
    return (global as any).testAppointmentRepository;
  }

  public get subscriptionRepository(): Repository<any> {
    return (global as any).testSubscriptionRepository;
  }

  public get guestSubscriptionRepository(): Repository<any> {
    return (global as any).testGuestSubscriptionRepository;
  }

  public getDefaultUser(): Promise<User> {
    return this.getUserByEmail(Testdata.EMAIL);
  }

  public getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({where: {
      email: email
    }})
  }

  public async createSchoolData(studentEmail?: string, instructorEmail?: string, schoolName?: string): Promise<{ studentUser: User, instructorUser: User, testSchool: School, student: Student, teamMember: TeamMember }> {
    const studentUser = await this.userRepository.save(Testdata.createUser(studentEmail || "student@student.com", "student", "student"));
    const instructorUser = await this.userRepository.save(Testdata.createUser(instructorEmail || "instructor@instructor.com", "instructor", "instructor"));
    const testSchool = await this.schoolRepository.save(Testdata.createSchool(schoolName || "test school"));
    const teamMember = await this.teamMemberRepository.save(Testdata.createTeamMember(testSchool, instructorUser, true));
    const student = await this.studentRepository.save(Testdata.createStudent(studentUser, testSchool));

    return {
      studentUser: studentUser,
      instructorUser: instructorUser,
      testSchool: testSchool,
      student: student,
      teamMember: teamMember
    };
  }

  public async createSchoolDataWithAppointment(studentEmail?: string, instructorEmail?: string, schoolName?: string, appointmentTypeName?: string) {
    const baseSchool = await this.createSchoolData(studentEmail, instructorEmail, schoolName);
    const appointmentType = await this.appointmentTypeRepository.save(Testdata.createAppointmentType(appointmentTypeName || "appointment type 1"));
    const appointments: Appointment[] = [];
    const date = new Date("2025-11-24T12:00:00");
    for (let i = 0; i < 4; i++) {
      const appoitment = new AppointmentBuilderTest(baseSchool.testSchool, baseSchool.instructorUser)
          .setAppointmentType(appointmentType)
          .setScheduling(date)
          .build();
      appointments.push(await this.appointmentRepository.save(appoitment));
      date.setDate(date.getDate() + 1);
    }
    return {
      ...baseSchool,
      appointments: appointments,
    };
  }

  public getData(): any {
    return (global as any).data;
  }

  async cleanupBetweenTests() {
    // Clear tables in the correct order (child tables first)
    // 1. Clear tables with no dependencies first
    await this.newsRepository.clear();
    await this.controlSheetRepository.clear();
    await this.noteRepository.clear();
    await this.emergencyContactRepository.clear();
    
    await this.subscriptionRepository.delete({});
    await this.guestSubscriptionRepository.delete({});
    await this.appointmentRepository.delete({});
    await this.appointmentTypeRepository.delete({});
    
    // 2. Clear flight-related data (flights might reference places/gliders)
    await this.flightRepository.delete({});
    
    // 3. Clear training-related data in correct order
    // team_member depends on school and user
    await this.teamMemberRepository.delete({});
    
    // student might depend on school  
    await this.studentRepository.delete({});
    
    // enrollment might depend on school
    await this.enrollmentRepository.delete({});
    
    // Now safe to delete schools (no more references)
    await this.schoolRepository.delete({});
    
    // 4. Clear other independent tables
    await this.placeRepository.delete({});
    await this.gliderRepository.delete({});

    // 5. Delete all users except the default test user (do this last)
    const defaultUser = Testdata.getDefaultUser();
    await this.userRepository.delete({
      email: Not(defaultUser.email)
    });
  }

  getRepository<T>(entity: new (...args: any[]) => T): Repository<T> {
    return this.dataSource.getRepository(entity);
  }
}