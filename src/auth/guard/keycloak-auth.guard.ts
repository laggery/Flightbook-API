import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KeycloakAuthGuard extends AuthGuard('keycloak') {
    private readonly logger = new Logger(KeycloakAuthGuard.name);

    // Override handleRequest to provide more detailed error messages
    handleRequest(err, user, info, context: ExecutionContext) {
        if (err) {
            this.logger.error(`Authentication error: ${err.message}`, err.stack);
            throw err;
        }
        
        if (!user) {
            this.logger.error('Authentication failed - no user returned from strategy');
            if (info) {
                this.logger.error(`Auth info: ${JSON.stringify(info)}`);
            }
            throw new UnauthorizedException('Invalid token');
        }
        
        this.logger.log(`User authenticated: ${user.userId}`);
        return user;
    }
}
