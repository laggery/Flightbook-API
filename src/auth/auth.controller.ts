import { Controller, Post, UseGuards, Request, Param, Get, HttpCode, Body, Headers } from '@nestjs/common';
import { CompositeAuthGuard } from './guard/composite-auth.guard';
import { AuthFacade } from './auth.facade';
import { LoginDto } from './interface/login-dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(private authFacade: AuthFacade) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Headers('accept-language') language: string) {
        return this.authFacade.login(loginDto, language);
    }

    @Post('google/login/:token')
    async googleLogin(@Param('token') token: string, @Headers('accept-language') language: string) {
        return this.authFacade.googleLogin(token, language);
    }

    @ApiOperation({ deprecated: true })
    @Get('refresh/:token')
    @ApiParam({name: 'token', required: true, schema: { oneOf: [{type: 'string'}]}})
    async refresh(@Param('token') token: string, @Headers('accept-language') language: string) {
        return this.authFacade.refresh(token, language);
    }

    @Post('refresh')
    @ApiParam({name: 'refresh_token', required: true, schema: { oneOf: [{type: 'string'}]}})
    async refreshPost(@Body('refresh_token') refreshToken: string, @Headers('accept-language') language: string) {
        return this.authFacade.refresh(refreshToken, language);
    }

    @ApiOperation({ deprecated: true })
    @UseGuards(CompositeAuthGuard)
    @Get('logout')
    @HttpCode(204)
    @ApiBearerAuth('jwt')
    async logout(@Request() req) {
        await this.authFacade.logout(req.user, null)
    }

    @UseGuards(CompositeAuthGuard)
    @Post('logout')
    @HttpCode(204)
    @ApiBearerAuth('jwt')
    @ApiParam({name: 'refresh_token', required: true, schema: { oneOf: [{type: 'string'}]}})
    async logoutPost(@Request() req, @Body('refresh_token') refreshToken: string) {
        await this.authFacade.logout(req.user, refreshToken)
    }

    @Get('reset-password/:email')
    async resetPassword(@Param('email') email) {
        return this.authFacade.resetPassword(email);
    }
}
