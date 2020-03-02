import { Injectable } from '@nestjs/common';
import { PlaceService } from './place.service';
import { UserService } from 'src/user/user.service';
import { PlaceDto } from './interface/place-dto';
import { User } from 'src/user/user.entity';
import { Place } from './place.entity';
import { plainToClass } from 'class-transformer';
import { PlaceAlreadyExistsException } from './exception/place-already-exists-exception';

@Injectable()
export class PlaceFacade {
    constructor(private placeService: PlaceService, private userService: UserService) { }

    async getPlaces(query: any): Promise<PlaceDto[]> {
        const list: Place[] = await this.placeService.getPlaces(query);
        return plainToClass(PlaceDto, list);
    }

    async createPlace(placeDto: PlaceDto): Promise<PlaceDto> {
        // TODO change user id from token
        const user: User = await this.userService.getUserById(1);
        const place: Place = plainToClass(Place, placeDto);
        place.user = user;

        // Check if name already existe for this user
        if (await this.placeService.getPlaceByName(place.name)) {
            throw new PlaceAlreadyExistsException();
        }

        const placeResp: Place = await this.placeService.addPlace(place);
        return plainToClass(PlaceDto, placeResp);
    }

    async updatePlace(id: number, placeDto: PlaceDto): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(id);

        // Check if name already existe for this user
        if (place.name !== placeDto.name && await this.placeService.getPlaceByName(place.name)) {
            throw new PlaceAlreadyExistsException();
        }

        place.name = placeDto.name;
        place.altitude = placeDto.altitude;
        const placeResp: Place = await this.placeService.updatePlace(place);
        return plainToClass(PlaceDto, placeResp);
    }

    async removePlace(id: number): Promise<PlaceDto> {
        const place: Place = await this.placeService.getPlaceById(id);
        const placeResp: Place = await this.placeService.removePlace(place);
        return plainToClass(PlaceDto, placeResp);
    }
}
