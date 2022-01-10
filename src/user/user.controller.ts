import { Controller, Post, Request, Body, Put, UseGuards, Get } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserPasswordWriteDto } from './interface/user-password-write-dto';
import { SchoolDto } from 'src/school/interface/school-dto';
import { TeamMemberFacade } from 'src/team-member/team-member.facade';

@Controller('users')
export class UserController {

    constructor(
        private userFacade: UserFacade,
        private teamMemberFacade: TeamMemberFacade) { }

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

    @UseGuards(JwtAuthGuard)
    @Get('schools')
    getSchoolsByUserId(@Request() req): Promise<SchoolDto[]> {
        return this.teamMemberFacade.getSchoolsByUserId(req.user.userId);
    }
}
