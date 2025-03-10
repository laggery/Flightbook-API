import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginType } from '../user/login-type';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService, private emailService: EmailService) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUserByEmail(email);

    if (user && user.loginType == LoginType.LOCAL && await bcrypt.compare(password, user.password) && user.enabled) {
      return user;
    }
    return null;
  }

  async login(user: User, language: string): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    let uuid;
    do {
      uuid = randomStringGenerator();
    } while (await this.userRepository.getUserByToken(uuid));
    user.token = uuid;
    const previousLogin = user.lastLogin;
    user.lastLogin = new Date();
    await this.userRepository.saveUser(user);

    if (!previousLogin && !user.paymentExempted && user.validatedAt != user.createdAt) {
      this.emailService.sendWelcomeEmail(user, language);
    }
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: uuid,
      lastLogin: previousLogin
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 11);
  }
}
