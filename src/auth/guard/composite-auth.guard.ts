import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable, firstValueFrom, from, isObservable } from 'rxjs';

@Injectable()
export class CompositeAuthGuard {
  private readonly logger = new Logger(CompositeAuthGuard.name);
  private jwtAuthGuard = new (AuthGuard('jwt'))();
  private keycloakAuthGuard = new (AuthGuard('keycloak'))();

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.tryKeycloak(context).catch(err => {
      this.logger.log('Keycloak authentication failed, trying JWT...');
      return this.tryJwt(context);
    });
  }

  private async tryJwt(context: ExecutionContext): Promise<boolean> {
    try {
      const result = this.jwtAuthGuard.canActivate(context);
      // Handle different return types
      if (typeof result === 'boolean') {
        if (result) {
          this.logger.log('JWT authentication successful');
        }
        return result;
      } else if (isObservable(result)) {
        const value = await firstValueFrom(result);
        if (value) {
          this.logger.log('JWT authentication successful');
        }
        return value;
      } else {
        // It's a Promise
        const value = await result;
        if (value) {
          this.logger.log('JWT authentication successful');
        }
        return value;
      }
    } catch (error) {
      this.logger.error(`JWT auth failed: ${error.message}`);
      throw error;
    }
  }

  private async tryKeycloak(context: ExecutionContext): Promise<boolean> {
    try {
      const result = this.keycloakAuthGuard.canActivate(context);
      // Handle different return types
      if (typeof result === 'boolean') {
        if (result) {
          this.logger.log('Keycloak authentication successful');
        }
        return result;
      } else if (isObservable(result)) {
        const value = await firstValueFrom(result);
        if (value) {
          this.logger.log('Keycloak authentication successful');
        }
        return value;
      } else {
        // It's a Promise
        const value = await result;
        if (value) {
          this.logger.log('Keycloak authentication successful');
        }
        return value;
      }
    } catch (error) {
      this.logger.debug(`Keycloak auth failed: ${error.message}`);
      throw error;
    }
  }

  // This method is required to properly handle the user extraction
  getAuthenticateOptions(context: ExecutionContext): any {
    // We need to delegate this to the appropriate guard
    // This is a simplified implementation
    return undefined;
  }

  // This is needed to properly extract and set the user in the request
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
