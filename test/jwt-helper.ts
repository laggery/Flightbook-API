import * as jwt from 'jsonwebtoken';

export class JwtTestHelper {
  static createKeycloakToken(payload: any = {}) {
    const defaultPayload = {
      sub: '1',
      name: 'Test User',
      email: 'test@user.com',
      preferred_username: 'testuser',
      realm_access: {
        roles: ['user']
      },
      resource_access: {
        'your-client-id': {
          roles: ['user']
        }
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      iss: 'http://localhost:8080/realms/your-realm',
      aud: 'your-client-id',
      typ: 'Bearer',
      azp: 'your-client-id',
      ...payload
    };

    // Use a test secret (make sure your Keycloak strategy accepts this in test mode)
    const secret = process.env.JWT_SECRET;
    
    return jwt.sign(defaultPayload, secret, { 
      algorithm: 'HS256',
      header: {
        typ: 'JWT',
        alg: 'HS256'
      }
    });
  }

  static createJwtToken(payload: any = {}) {
    const defaultPayload = {
      sub: 1,
      email: 'test@example.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      ...payload
    };

    const secret = process.env.JWT_SECRET;
    return jwt.sign(defaultPayload, secret);
  }
}