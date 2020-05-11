import { Controller, Post, Request, Body, Put, Param, UseGuards, Get } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserPasswordWriteDto } from './interface/user -password-write-dto';

@Controller('users')
export class UserController {

    constructor(private userFacade: UserFacade) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getCurrentUser(@Request() req): Promise<UserReadDto> {
        return this.userFacade.getCurrentUser(req.user.userId);
    }

    @Post()
    createUser(@Body() userWriteDto: UserWriteDto): Promise<UserReadDto> {
        return this.userFacade.createUser(userWriteDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    updateUser(@Request() req, @Body() userWriteDto: UserWriteDto): Promise<UserReadDto> {
        return this.userFacade.updateUser(req.user.userId, userWriteDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('password/change')
    updateUserPassword(@Request() req, @Body() userPasswordWriteDto: UserPasswordWriteDto): Promise<UserReadDto> {
        return this.userFacade.updatePassword(req.user.userId, userPasswordWriteDto);
    }
}
