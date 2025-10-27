import { User } from "../src/user/domain/user.entity";
import { News } from "../src/news/news.entity";
import { readFileSync } from "fs";
import * as path from 'path';
import { ControlSheet } from "../src/training/control-sheet/control-sheet.entity";
import { Place } from "../src/place/place.entity";
import { PlaceDto } from "../src/place/interface/place-dto";
import { PlaceMapper } from "../src/place/place.mapper";
import { Glider } from "../src/glider/glider.entity";
import { plainToClass } from "class-transformer";
import { GliderDto } from "../src/glider/interface/glider-dto";
import { Flight } from "../src/flight/flight.entity";
import { FlightDto } from "../src/flight/interface/flight-dto";
import { UserWriteDto } from "src/user/interface/user-write-dto";

export class Testdata {
    public static EMAIL = "test@user.com";

    public static request = {
        user: {
            userId: 1
        }
    }

    public static token = {
        userId: 1
    }

    public static createNews(language: string): News {
        const news = new News();
        news.date = '01.01.2024';
        news.title = 'title';
        news.text = 'text';
        news.language = language;
        return news;
    }

    public static createPlaceDto(name: string): PlaceDto {
        return PlaceMapper.toPlaceDto(this.createPlace(name));
    }

    public static createPlace(name: string): Place {
        const place = new Place();
        place.name = name;
        place.altitude = 1000;
        place.country = 'CH'
        place.notes = "notice"
        place.user = this.createUser();
        return place;
    }

    public static createGliderDto(brand: string, name: string, tandem: boolean): GliderDto {
        return plainToClass(GliderDto, this.createGlider(brand, name, tandem));
    }

    public static createGlider(brand: string, name: string, tandem: boolean): Glider {
        const glider = new Glider();
        glider.brand = brand;
        glider.name = name;
        glider.buyDate = '2020-01-01';
        glider.note = "note";
        glider.tandem = tandem;
        glider.archived = false;
        glider.user = this.createUser();
        return glider;
    }

    public static createFlightDto(
        start: Place,
        landing: Place,
        glider: Glider,
        date?: string,
        timestamp?: Date
    ): FlightDto {
        return plainToClass(FlightDto, this.createFlight(start, landing, glider, date, timestamp));
    }

    public static createFlight(
        start?: Place,
        landing?: Place,
        glider?: Glider,
        date?: string,
        timestamp?: Date
    ): Flight {
        const flight = new Flight();
        flight.date = date || '2024-01-01';
        flight.start = start || this.createPlace("Start");
        flight.landing = landing || this.createPlace("Landing");
        flight.glider = glider || this.createGlider("Brand", "Name", false);
        flight.km = 100.2;
        flight.time = "01:30";
        flight.description = "description";
        flight.user = this.createUser();
        flight.timestamp = timestamp || new Date();
        return flight;
    }

    public static createControlSheet(userCanEdit: boolean): ControlSheet {
        const controlSheet = new ControlSheet();
        controlSheet.userCanEdit = userCanEdit;
        controlSheet.altitudeFlight.id = 1;
        controlSheet.trainingHill.id = 1;
        controlSheet.theory.id = 1;
        controlSheet.level.id = 1;
        controlSheet.user = this.createUser();
        return controlSheet;
    }

    public static createUserDto(
        firstname: string,
        lastname: string,
        email: string
    ): UserWriteDto {
        const user: UserWriteDto = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: "Password123!",
            phone: undefined,
            config: undefined
        };
        return user;
    }

    public static createUser(): User {
        const user = new User();
        user.id = 1;
        user.firstname = "test";
        user.lastname = "user";
        user.email = "test@user.com";
        return user;
    }

    public static readFile(fileName: string): Express.Multer.File {
        const filePath = path.join(__dirname, `/resources/${fileName}`);
        const buffer = readFileSync(filePath);
        const file = {
            buffer,
            originalname: "test.csv",
            filename: "test.csv",
            encoding: "UTF8",
            stream: null,
            mimetype: null,
            destination: null,
            path: null,
            fieldname: null,
            size: null
        }
        return file
    }
}
