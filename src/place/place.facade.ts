import { Injectable, Logger } from '@nestjs/common';
import { PlaceService } from './place.service';
import { UserService } from '../user/user.service';
import { PlaceDto } from './interface/place-dto';
import { User } from '../user/user.entity';
import { Place } from './place.entity';
import { plainToClass } from 'class-transformer';
import { PlaceAlreadyExistsException } from './exception/place-already-exists-exception';
import { PagerDto } from 'src/interface/pager-dto';
import { PlaceMapper } from './place.mapper';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlaceFacade {
    constructor(
        private placeService: PlaceService,
        private userService: UserService,
        private readonly httpService: HttpService
    ) { }

    async getPlaces(token: any, query: any): Promise<PlaceDto[]> {
        const list: Place[] = await this.placeService.getPlaces(token, query);
        return PlaceMapper.toPlaceDtoList(list);
    }

    async getPlacesPager(token: any, query: any): Promise<PagerDto> {
        return this.placeService.getPlacesPager(token, query);
    }

    async getPlacesByName(token: any,  query: any, name: string): Promise<PlaceDto[]> {
        const list: Place[] = await this.placeService.getPlacesByName(token, query, name);
        return PlaceMapper.toPlaceDtoList(list);
    }

    async createPlace(token: any, placeDto: PlaceDto): Promise<PlaceDto> {
        const user: User = await this.userService.getUserById(token.userId);
        const place: Place = plainToClass(Place, placeDto);
        place.id = null;
        place.user = user;
        if (placeDto.coordinates && placeDto.coordinates != null) {
            place.point = {
                type: "Point",
                coordinates: placeDto.coordinates
            }
        }

        // Check if name already existe for this user
        if (await this.placeService.getPlaceByName(token, place.name)) {
            throw new PlaceAlreadyExistsException();
        }

        const placeResp: Place = await this.placeService.addPlace(place);
        return PlaceMapper.toPlaceDto(placeResp);
    }

    async updatePlace(token: any, id: number, placeDto: PlaceDto): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(token, id);

        // Check if name already existe for this user
        if (place.name !== placeDto.name && await this.placeService.getPlaceByName(token, placeDto.name)) {
            throw new PlaceAlreadyExistsException();
        }

        place.name = placeDto.name;
        place.altitude = placeDto.altitude;
        place.notes = placeDto.notes;
        place.country = placeDto.country;
        if (placeDto.coordinates && placeDto.coordinates != null) {
            if (!place.point) {
                place.point = {
                    type: "Point",
                    coordinates: placeDto.coordinates
                }
            } else {
                place.point.coordinates = placeDto.coordinates;
            }
        }
        
        const placeResp: Place = await this.placeService.updatePlace(place);
        return PlaceMapper.toPlaceDto(placeResp);
    }

    async removePlace(token: any, id: number): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(token, id);
        const placeResp: Place = await this.placeService.removePlace(place);
        return PlaceMapper.toPlaceDto(placeResp);
    }

    async getPlaceByName(token: any, name: string): Promise<PlaceDto | undefined> {
        const place: Place = await this.placeService.getPlaceByName(token, name);
        return PlaceMapper.toPlaceDto(place);
    }

    async getPlaceMetadata(query: any): Promise<PlaceDto> {
        const placeDto = new PlaceDto();
        try {
            const altResp = await firstValueFrom(this.httpService.get(`https://api.opentopodata.org/v1/srtm30m?locations=${query.lat},${query.lng}`));
            placeDto.altitude = altResp.data.results[0]?.elevation;
        } catch (exception) {
            Logger.warn("Altitude request error", exception);
        }

        try {
            const countryResp: any = await firstValueFrom(this.httpService.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${query.lat}&lon=${query.lng}`));
            placeDto.country = countryResp?.data?.address?.country_code;
        } catch (exception) {
            Logger.warn("Country request error", exception);
        }

        return placeDto;
    }
}
