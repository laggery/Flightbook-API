import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MapConfigurationDto } from './interface/map-configuration-dto';
import { CompositeAuthGuard } from '../auth/guard/composite-auth.guard';
import { VersionCheckRequestDto } from './interface/version-check-request.dto';
import { VersionCheckResponseDto } from './interface/version-check-response.dto';
import { ConfigurationFacade } from './configuration.facade';

@Controller('configuration')
@ApiTags('Configuration')
@ApiBearerAuth('jwt')
export class ConfigurationController {
    constructor(private readonly configurationFacade: ConfigurationFacade) {}

    @UseGuards(CompositeAuthGuard)
    @Get('map')
    getMapConfiguration(): MapConfigurationDto {
        return this.configurationFacade.getMapConfiguration();
    }

    @Post('version-check')
    checkVersion(@Body() request: VersionCheckRequestDto): VersionCheckResponseDto {
        return this.configurationFacade.checkVersion(request);
    }
}