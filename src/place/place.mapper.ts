import { plainToInstance } from "class-transformer";
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { Place } from "./place.entity";
import { PlaceDto } from "./interface/place-dto";

export class PlaceMapper {

    public static toPlaceDtoList(places: Place[]): PlaceDto[] {
        const placeDtoList = [];
        places.forEach((place: Place) => {
            placeDtoList.push(this.toPlaceDto(place));
        })
        return placeDtoList
    }

    public static toPlaceDto(place: Place): PlaceDto {
        const placeDto: PlaceDto = plainToInstance(PlaceDto, place);

        if (place.point) {
            placeDto.coordinates = place.point.coordinates;
        }

        return placeDto
    }
}
