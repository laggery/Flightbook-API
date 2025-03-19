import { Controller, Post, UseGuards, Request, Param, Get, HttpCode, Body, Headers } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthFacade } from './auth.facade';
import { LoginDto } from './interface/login-dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { KeycloakService } from './service/keycloak.service';
import { KeycloakLoginDto } from './interface/keycloak-login-dto';
import { TokenResponseDto } from './interface/token-response.dto';
import { KeycloakAuthGuard } from './guard/keycloak-auth.guard';
import { UserRepository } from '../user/user.repository';

@Controller({
        path: 'auth',
        version: '2'
    })
@ApiTags('Auth v2')
export class AuthControllerV2 {
    constructor(
        private keycloakService: KeycloakService,
        private userRepository: UserRepository,
    ) { }

    @Post('login')
    async login(@Body() loginDto: KeycloakLoginDto, @Headers('accept-language') language: string): Promise<TokenResponseDto> {
        const keycloakResponse = await this.keycloakService.login(loginDto.username, loginDto.password);
        
        // Get user info to update last login and link Keycloak ID
        const userInfo = await this.keycloakService.getUserInfo(keycloakResponse.access_token);
        const user = await this.userRepository.getUserByEmail(userInfo.email);
        
        if (!user) {
            throw new Error(`User with email ${userInfo.email} not found`);
        }
        
        const previousLogin = user.lastLogin;
        user.lastLogin = new Date();
        
        // Link Keycloak ID to user - this is critical for KeycloakAuthGuard
        user.keycloakId = userInfo.sub;
        await this.userRepository.saveUser(user);
        
        return {
            ...keycloakResponse,
            lastLogin: previousLogin
        };
    }

    @Post('refresh')
    async refresh(@Body('refresh_token') refreshToken: string, @Headers('accept-language') language: string): Promise<TokenResponseDto> {
        const keycloakResponse = await this.keycloakService.refreshToken(refreshToken);
        
        // Get user info 
        const userInfo = await this.keycloakService.getUserInfo(keycloakResponse.access_token);
        const user = await this.userRepository.getUserByKeycloakId(userInfo.sub);
        
        return {
            ...keycloakResponse,
            lastLogin: user.lastLogin
        };
    }

    @UseGuards(KeycloakAuthGuard)
    @Get('logout')
    @HttpCode(204)
    @ApiBearerAuth('jwt')
    async logout(@Request() req, @Body('refresh_token') refreshToken: string) {
        await this.keycloakService.logout(refreshToken);
        
        // Update user last login
        const user = await this.userRepository.getUserById(req.user.userId);
        user.lastLogin = new Date();
        await this.userRepository.saveUser(user);
    }

    @Get('reset-password/:email')
    async resetPassword(@Param('email') email: string) {
        return this.keycloakService.resetPassword(email);
    }
}
