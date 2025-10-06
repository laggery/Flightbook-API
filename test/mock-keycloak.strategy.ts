import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class MockKeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: true, // Ignore expiration for tests
          secretOrKey: process.env.JWT_SECRET,
          algorithms: ['HS256'],
        });
      }
  
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
    };
  }
}