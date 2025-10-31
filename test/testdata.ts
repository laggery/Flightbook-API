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
import { School } from "../src/training/school/school.entity";
import { SchoolDto } from "../src/training/school/interface/school-dto";
import { TeamMember } from "../src/training/team-member/team-member.entity";
import { Enrollment } from "../src/training/enrollment/enrollment.entity";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { EnrollmentType } from "../src/training/enrollment/enrollment-type";

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
        place.user = this.getDefaultUser();
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
        glider.user = this.getDefaultUser();
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
        flight.user = this.getDefaultUser();
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
        controlSheet.user = this.getDefaultUser();
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

    public static createSchoolDto(name: string): SchoolDto {
        return plainToClass(SchoolDto, this.createSchool(name));
    }

    public static createSchool(name: string): School {
        const school = new School();
        school.name = name;
        school.address1 = "address";
        school.address2 = "address2";
        school.plz = "1234";
        school.city = "city";
        school.phone = "0123456789";
        school.email = "school@example.com";
        school.language = "de";
        school.configuration = {
            validateFlights: true,
            userCanEditControlSheet: true
        };
        return school;
    }

    public static createEnrollment(school: School, email: string, type: EnrollmentType): Enrollment {
        const enrollment = new Enrollment();
        enrollment.school = school;
        enrollment.email = email;
        enrollment.expireAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
        enrollment.token = randomStringGenerator();
        enrollment.type = type;
        return enrollment;
    }

    public static createTeamMember(school: School, user: User, isAdmin: boolean = false): TeamMember {
        const teamMember = new TeamMember();
        teamMember.school = school;
        teamMember.user = user;
        teamMember.admin = isAdmin;
        return teamMember;
    }

    public static createUser(email?: string): User {
        const user = new User();
        user.firstname = "test";
        user.lastname = "user";
        user.email = email || this.EMAIL;
        return user;
    }

    public static getDefaultUser(): User {
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
