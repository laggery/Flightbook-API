import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    let uuid;
    do {
      uuid = randomStringGenerator();
    } while (await this.userService.getUserByToken(uuid));
    user.token = uuid;
    await this.userService.saveUser(user);

    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: uuid
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 11);
  }
}
