import { Controller, Post, Request, Body, Put, UseGuards, Get, Delete, HttpCode, Headers, Query } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserPasswordWriteDto } from './interface/user-password-write-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth('jwt')
export class UserController {

    constructor(
        private userFacade: UserFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getCurrentUser(@Request() req): Promise<UserReadDto> {
        return this.userFacade.getCurrentUser(req.user.userId);
    }

    @Post()
    createUser(@Body() userWriteDto: UserWriteDto, @Headers('accept-language') language: string, @Headers('origin') origin: string): Promise<UserReadDto> {
        let isInstructorApp = false;
        if (origin.includes(process.env.ORIGIN_INSTRUCTOR)) {
            isInstructorApp = true;
        }
        return this.userFacade.createUser(userWriteDto, isInstructorApp, language);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateUser(@Request() req, @Body() userWriteDto: UserWriteDto): Promise<UserReadDto> {
        return this.userFacade.updateUser(req.user.userId, userWriteDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    @HttpCode(204)
    disableUser(@Request() req): Promise<UserReadDto> {
        return this.userFacade.disableUser(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('password/change')
    updateUserPassword(@Request() req, @Body() userPasswordWriteDto: UserPasswordWriteDto): Promise<UserReadDto> {
        return this.userFacade.updatePassword(req.user.userId, userPasswordWriteDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('notification/token')
    @HttpCode(204)
    updateUserNotificationToken(@Request() req, @Body() notificationToken: any): Promise<UserReadDto> {
        return this.userFacade.updateNotificationToken(req.user.userId, notificationToken.token);
    }

    @Get('verify-email')
    @HttpCode(204)
    async verifyEmail(@Query('token') token: string): Promise<void> {
        await this.userFacade.verifyEmail(token);
    }
}
