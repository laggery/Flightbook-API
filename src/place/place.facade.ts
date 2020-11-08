import { Injectable } from '@nestjs/common';
import { PlaceService } from './place.service';
import { UserService } from '../user/user.service';
import { PlaceDto } from './interface/place-dto';
import { User } from '../user/user.entity';
import { Place } from './place.entity';
import { plainToClass } from 'class-transformer';
import { PlaceAlreadyExistsException } from './exception/place-already-exists-exception';
import { PagerDto } from 'src/interface/pager-dto';

@Injectable()
export class PlaceFacade {
    constructor(private placeService: PlaceService, private userService: UserService) { }

    async getPlaces(token: any, query: any): Promise<PlaceDto[]> {
        const list: Place[] = await this.placeService.getPlaces(token, query);
        return plainToClass(PlaceDto, list);
    }

    async getPlacesPager(token: any, query: any): Promise<PagerDto> {
        return this.placeService.getPlacesPager(token, query);
    }

    async getPlacesByName(token: any,  query: any, name: string): Promise<PlaceDto[]> {
        const list: Place[] = await this.placeService.getPlacesByName(token, query, name);
        return plainToClass(PlaceDto, list);
    }

    async createPlace(token: any, placeDto: PlaceDto): Promise<PlaceDto> {
        const user: User = await this.userService.getUserById(token.userId);
        const place: Place = plainToClass(Place, placeDto);
        place.id = null;
        place.user = user;

        // Check if name already existe for this user
        if (await this.placeService.getPlaceByName(token, place.name)) {
            throw new PlaceAlreadyExistsException();
        }

        const placeResp: Place = await this.placeService.addPlace(place);
        return plainToClass(PlaceDto, placeResp);
    }

    async updatePlace(token: any, id: number, placeDto: PlaceDto): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(token, id);

        // Check if name already existe for this user
        if (place.name !== placeDto.name && await this.placeService.getPlaceByName(token, placeDto.name)) {
            throw new PlaceAlreadyExistsException();
        }

        place.name = placeDto.name;
        place.altitude = placeDto.altitude;
        const placeResp: Place = await this.placeService.updatePlace(place);
        return plainToClass(PlaceDto, placeResp);
    }

    async removePlace(token: any, id: number): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(token, id);
        const placeResp: Place = await this.placeService.removePlace(place);
        return plainToClass(PlaceDto, placeResp);
    }

    async getPlaceByName(token: any, name: string): Promise<PlaceDto | undefined> {
        const place: Place = await this.placeService.getPlaceByName(token, name);
        return plainToClass(PlaceDto, place);
    }
}
