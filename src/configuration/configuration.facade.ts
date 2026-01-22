import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { MapConfigurationDto } from './interface/map-configuration-dto';
import { VersionCheckRequestDto, Platform } from './interface/version-check-request.dto';
import { VersionCheckResponseDto, UpdateStatus } from './interface/version-check-response.dto';

@Injectable()
export class ConfigurationFacade {

    constructor() {}

    getMapConfiguration(): MapConfigurationDto {
        return {
            url: process.env.MAP_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attributions: process.env.MAP_ATTRIBUTIONS || '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
            crossOrigin: process.env.MAP_CROSS_ORIGIN || 'anonymous'
        };
    }

    checkVersion(request: VersionCheckRequestDto): VersionCheckResponseDto {
        const isAndroid = request.platform === Platform.ANDROID;
        
        const minBuild = parseInt(
            isAndroid 
                ? process.env.ANDROID_MINIMAL_VERSION_BUILD || '0'
                : process.env.IOS_MINIMAL_VERSION_BUILD || '0'
        );
        
        const latestBuild = parseInt(
            isAndroid 
                ? process.env.ANDROID_LATEST_BUILD || '0'
                : process.env.IOS_LATEST_BUILD || '0'
        );
        
        const appId = isAndroid
            ? process.env.ANDROID_APP_ID || 'ch.flightbook.MobileFlight'
            : process.env.IOS_APP_ID || 'id1046316231';

        let status: UpdateStatus;
        let message: string;

        const i18n = I18nContext.current();
        if (request.build_number < minBuild) {
            status = UpdateStatus.FORCE_UPDATE;
            message = i18n.translate('translation.versionCheck.forceUpdate', { lang: request.locale });
        } else if (request.build_number < latestBuild) {
            status = UpdateStatus.OPTIONAL_UPDATE;
            message = i18n.translate('translation.versionCheck.optionalUpdate', { lang: request.locale });
        } else {
            status = UpdateStatus.UP_TO_DATE;
            message = i18n.translate('translation.versionCheck.upToDate', { lang: request.locale });
        }

        return {
            status,
            min_supported_build: minBuild,
            latest_build: latestBuild,
            app_id: appId,
            message,
        };
    }
}
