import { Controller, Post, Body, Headers, UseGuards, Get, Req, Put, Param } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { UserWriteDto } from './interface/user-write-dto';
import { UserReadDto } from './interface/user-read-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KeycloakAuthGuard } from '../auth/guard/keycloak-auth.guard';
import { UserRepository } from './user.repository';

@Controller({
    path: 'users',
    version: '3'
})
@ApiTags('User v3')
@ApiBearerAuth('jwt')
export class UserControllerV3 {

    constructor(
        private userFacade: UserFacade,
        private userRepository: UserRepository
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    async createUser(
        @Body() userWriteDto: UserWriteDto, 
        @Headers('accept-language') language: string, 
        @Headers('origin') origin: string
    ): Promise<UserReadDto> {
        let isInstructorApp = false;
        if (origin.includes(process.env.ORIGIN_INSTRUCTOR)) {
            isInstructorApp = true;
        }
        
        // Create user in your system
        const user = await this.userFacade.createUser(userWriteDto, isInstructorApp, language);
        
        return user;
    }

    @UseGuards(KeycloakAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Req() req) {
        const user = await this.userRepository.getUserById(req.user.userId);
        return this.userFacade.mapUserToReadDto(user);
    }

    @UseGuards(KeycloakAuthGuard)
    @Put('profile')
    @ApiOperation({ summary: 'Update current user profile' })
    async updateProfile(@Req() req, @Body() userWriteDto: UserWriteDto) {
        const user = await this.userRepository.getUserById(req.user.userId);
        
        // Update user properties
        user.firstname = userWriteDto.firstname;
        user.lastname = userWriteDto.lastname;
        user.phone = userWriteDto.phone;
        
        // Save updated user
        const updatedUser = await this.userRepository.saveUser(user);
        
        return this.userFacade.mapUserToReadDto(updatedUser);
    }

    @UseGuards(KeycloakAuthGuard)
    @Put('notification-token/:token')
    @ApiOperation({ summary: 'Update user notification token' })
    async updateNotificationToken(@Req() req, @Param('token') token: string) {
        const user = await this.userRepository.getUserById(req.user.userId);
        user.updateNotificationToken(token);
        await this.userRepository.saveUser(user);
        return { success: true };
    }
}
