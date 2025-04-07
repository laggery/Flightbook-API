import { Controller, Post, Request, Body, Put, UseGuards, Get, Delete, HttpCode, Headers, Query } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { UserPasswordWriteDto } from './interface/user-password-write-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth('jwt')
export class UserController {

    constructor(
        private userFacade: UserFacade) { }

    @UseGuards(CompositeAuthGuard)
    @Get()
    getCurrentUser(@Request() req): Promise<UserReadDto> {
        return this.userFacade.getCurrentUser(req.user.userId);
    }

    @Post()
    createUser(@Body() userWriteDto: UserWriteDto): Promise<UserReadDto> {
        return this.userFacade.createUser(userWriteDto, true, null);
    }

    @UseGuards(CompositeAuthGuard)
    @Put()
    updateUser(@Request() req, @Body() userWriteDto: UserWriteDto): Promise<UserReadDto> {
        return this.userFacade.updateUser(req.user.userId, userWriteDto);
    }

    @UseGuards(CompositeAuthGuard)
    @Delete()
    @HttpCode(204)
    disableUser(@Request() req): Promise<UserReadDto> {
        return this.userFacade.disableUser(req.user.userId);
    }

    @UseGuards(CompositeAuthGuard)
    @Put('password/change')
    updateUserPassword(@Request() req, @Body() userPasswordWriteDto: UserPasswordWriteDto): Promise<UserReadDto> {
        return this.userFacade.updatePassword(req.user.userId, userPasswordWriteDto);
    }

    @UseGuards(CompositeAuthGuard)
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
