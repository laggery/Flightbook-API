import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from "@nestjs/common";
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError'
import { Response } from 'express';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
    catch(exception: EntityNotFoundError, host: ArgumentsHost) {
        const error = new NotFoundException(exception.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
            .status(error.getStatus())
            .json(error.getResponse());
    }
}
