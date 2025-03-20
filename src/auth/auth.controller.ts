import { Controller, Post, UseGuards, Request, Param, Get, HttpCode, Body, Headers } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CompositeAuthGuard } from './guard/composite-auth.guard';
import { AuthFacade } from './auth.facade';
import { LoginDto } from './interface/login-dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authFacade: AuthFacade) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto, @Headers('accept-language') language: string) {
        return this.authFacade.login(req.user, language);
    }

    @Post('google/login/:token')
    async googleLogin(@Param('token') token: string, @Headers('accept-language') language: string) {
        return this.authFacade.googleLogin(token, language);
    }

    @Get('refresh/:token')
    @ApiParam({name: 'token', required: true, schema: { oneOf: [{type: 'string'}]}})
    async refresh(@Param('token') token, @Headers('accept-language') language: string) {
        return this.authFacade.refresh(token, language);
    }

    @UseGuards(CompositeAuthGuard)
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
