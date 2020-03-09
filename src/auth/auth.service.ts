import { Injectable } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && user.password === password) {
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
    this.userService.saveUser(user);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: uuid
    };
  }
}
