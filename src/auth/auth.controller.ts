import { Controller, Post, UseGuards, Request, Param, Get, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthFacade } from './auth.facade';

@Controller('auth')
export class AuthController {

    constructor(private authFacade: AuthFacade) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authFacade.login(req.user);
    }

    @Get('refresh/:token')
    async refresh(@Param('token') token) {
        return this.authFacade.refresh(token);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @HttpCode(204)
    async logout(@Request() req) {
        await this.authFacade.logout(req.user)
    }

    @Get('reset-password/:email')
    async resetPassword(@Param('email') email) {
        return this.authFacade.resetPassword(email);
    }
}
