import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MapConfigurationDto } from './interface/map-configuration-dto';

@Controller('configuration')
@ApiTags('Configuration')
@ApiBearerAuth('jwt')
export class ConfigurationController {
    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get('map')
    getMapConfiguration(): MapConfigurationDto {
        const mapConfigurationDto = {
            url: process.env.MAP_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: process.env.MAP_ATTRIBUTIONS || '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
            crossOrigin: process.env.MAP_CROSS_ORIGIN || 'anonymous'
        };
        return mapConfigurationDto;
    }
}