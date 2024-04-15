import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { TestBed } from '@automock/jest';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>,
      jwtService: jest.Mocked<JwtService>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    service = unit;
    userRepository = unitRef.get(UserRepository);
    jwtService = unitRef.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
