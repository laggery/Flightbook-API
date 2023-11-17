import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ConflictException, UnprocessableEntityException, Logger } from "@nestjs/common";
import { Response } from 'express';
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        let error: HttpException;
        switch(exception.sqlState) {
            case "23000":
                error = new ConflictException("Entity cannot be deleted or updated because it is used by another entity");
                break;
            default:
                Logger.error(exception, exception.query, "Database error");
                error = new UnprocessableEntityException("Database error");
        }
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response
            .status(error.getStatus())
            .json(error.getResponse());
    }
}
