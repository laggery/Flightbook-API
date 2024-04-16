import { Controller, Post, UseGuards, Request, Param, Get, HttpCode, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthFacade } from './auth.facade';
import { LoginDto } from './interface/login-dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authFacade: AuthFacade) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return this.authFacade.login(req.user);
    }

    @Post('google/login/:token')
    async googleLogin(@Param('token') token: string) {
        return this.authFacade.googleLogin(token);
    }

    @Get('refresh/:token')
    @ApiParam({name: 'token', required: true, schema: { oneOf: [{type: 'string'}]}})
    async refresh(@Param('token') token) {
        return this.authFacade.refresh(token);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    @HttpCode(204)
    @ApiBearerAuth('jwt')
    async logout(@Request() req) {
        await this.authFacade.logout(req.user)
    }

    @Get('reset-password/:email')
    async resetPassword(@Param('email') email) {
        return this.authFacade.resetPassword(email);
    }
}
