import * as request from 'supertest';
import { Testdata } from '../testdata';
import { BaseE2ETest } from '../base-e2e-test';
import { JwtTestHelper } from '../jwt-helper';
import { UserWriteDto } from '../../src/user/interface/user-write-dto';
import { User } from '../../src/user/domain/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

describe('Users (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/users get the current user (GET)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/users`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          config: null,
          loginType: 'LOCAL',
          phone: null
        });
      });
  });

  it('/users (POST)', async () => {
    // given
    const userDto = Testdata.createUserDto("a", "a", "a@a.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(userDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        await assertUser(testInstance, response, userDto, true);
      });
  });

  it('/users already exists (POST)', async () => {
    // given
    const userDto = Testdata.createUserDto("a", "a", "test@user.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(userDto)
      .expect(409)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('The user already exists.');
      });
  });

  it('/users (PUT)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    user.validatedAt = new Date();
    user.keycloakId = "mocked-keycloak-user-id";
    user.paymentExempted = false;
    await testInstance.userRepository.save(user);

    const userDto = {
      ...plainToInstance(UserWriteDto, user),
      firstname: "updated-name",
      lastname: "updated-lastname"
    };
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/users`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(userDto)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        await assertUser(testInstance, response, userDto, true);
      });
  });

  it('/users (DELETE)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .delete(`/users`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.userRepository.findOne({
          where: { email: user.email }
        });
        expect(db).toBeDefined();
        expect(db.enabled).toBeFalsy();
      });
  });

  it('/users/password/change (PUT)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    user.keycloakId = "keycloak-id";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/users/password/change`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send({ oldPassword: 'old-password', newPassword: 'new-password' })
      .expect(200)
      .then(async () => {
        const db = await testInstance.userRepository.findOne({
          where: { email: user.email }
        });
        expect(db).toBeDefined();
        expect(await bcrypt.compare("new-password", db.password)).toBeTruthy();
      });
  });

  it('/users/notification/token (PUT)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .put(`/users/notification/token`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send({ token: 'new-notification-token' })
      .expect(204)
      .then(async () => {
        const db = await testInstance.userRepository.findOne({
          where: { email: user.email }
        });
        expect(db).toBeDefined();
        expect(db.notificationToken).toBe('new-notification-token');
      });
  });

  it('/users/verify-email (GET)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    user.confirmationToken = "some-emailConfirmation-token";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/users/verify-email?token=${user.confirmationToken}`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(204)
      .then(async () => {
        const db = await testInstance.userRepository.findOne({
          where: { email: user.email }
        });
        expect(db).toBeDefined();
        expect(db.confirmationToken).toBeNull();
      });
  });

  it('/users/verify-email invalid token (GET)', async () => {
    // given
    const user = new User();
    user.firstname = "a";
    user.lastname = "a";
    user.email = "a@a.com";
    user.confirmationToken = "some-emailConfirmation-token";
    await testInstance.userRepository.save(user);
    const keycloakToken = JwtTestHelper.createKeycloakToken({
      sub: user.id.toString()
    });

    //when
    return request(testInstance.app.getHttpServer())
      .get(`/users/verify-email?token=anyother-token`)
      .set('Authorization', `Bearer ${keycloakToken}`)
      .expect(400)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toBe('Invalid verification token');

        const db = await testInstance.userRepository.findOne({
          where: { email: user.email }
        });
        expect(db).toBeDefined();
        expect(db.confirmationToken).toEqual(user.confirmationToken);
      });
  });
});

describe('V2 Users (e2e)', () => {
  const testInstance = new BaseE2ETest();

  beforeEach(async () => {
    await testInstance.cleanupBetweenTests();
  });

  it('/v2/users mobile app (POST)', async () => {
    // given
    const userDto = Testdata.createUserDto("a", "a", "a@a.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/v2/users')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .set('accept-language', 'de')
      .set('origin', Testdata.MOBILE_APP_ORIGIN)
      .send(userDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        await assertUser(testInstance, response, userDto);
      });
  });

  it('/v2/users instructor app (POST)', async () => {
    // given
    const userDto = Testdata.createUserDto("a", "a", "a@a.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/v2/users')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .set('accept-language', 'de')
      .set('origin', Testdata.INSTRUCTOR_APP_ORIGIN)
      .send(userDto)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        await assertUser(testInstance, response, userDto, true);
      });
  });

  it('/users already exists (POST)', async () => {
    // given
    const userDto = Testdata.createUserDto("a", "a", "test@user.com");
    const keycloakToken = JwtTestHelper.createKeycloakToken();

    //when
    return request(testInstance.app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${keycloakToken}`)
      .send(userDto)
      .expect(409)
      .then(async (response) => {
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('The user already exists.');
      });
  });
});

async function assertUser(testInstance: any, received: any, expected: UserWriteDto, isValidated = false) {
  expect(received.body).toEqual({
    firstname: expected.firstname,
    lastname: expected.lastname,
    email: expected.email,
    config: null,
    loginType: 'LOCAL',
    phone: null
  });

  const db = await testInstance.userRepository.findOne({
    where: { email: received.body.email }
  });
  expect(db).toBeDefined();
  expect(db).toMatchObject({
    id: expect.any(Number),
    firstname: expected.firstname,
    lastname: expected.lastname,
    email: expected.email,
    keycloakId: 'mocked-keycloak-user-id',
    paymentExempted: false,
    confirmationToken: isValidated ? null : expect.any(String),
    enabled: true
  });

  if (isValidated) {
    expect(db.validatedAt).toBeDefined();
  }
}