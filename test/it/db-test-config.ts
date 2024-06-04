import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AltitudeFlight } from "../../src/training/control-sheet/altitude-flight.entity";
import { Theory } from "../../src/training/control-sheet/theory.entity";
import { TrainingHill } from "../../src/training/control-sheet/training-hill.entity";
import { GuestSubscription } from "../../src/training/subscription/guest-subscription.entity";
import { Flight } from "../../src/flight/flight.entity";
import { Glider } from "../../src/glider/glider.entity";
import { News } from "../../src/news/news.entity";
import { Place } from "../../src/place/place.entity";
import { AppointmentType } from "../../src/training/appointment/appointment-type.entity";
import { Appointment } from "../../src/training/appointment/appointment.entity";
import { ControlSheet } from "../../src/training/control-sheet/control-sheet.entity";
import { Enrollment } from "../../src/training/enrollment/enrollment.entity";
import { Note } from "../../src/training/note/note.entity";
import { School } from "../../src/training/school/school.entity";
import { Student } from "../../src/training/student/student.entity";
import { TeamMember } from "../../src/training/team-member/team-member.entity";
import { User } from "../../src/user/user.entity";
import { Subscription } from "../../src/training/subscription/subscription.entity";
import { Level } from "../../src/training/control-sheet/level.entity";

const dbConfigBase: any = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA,
    entities: [
        Flight,
        Glider,
        News,
        Place,
        AppointmentType,
        Appointment,
        ControlSheet,
        TrainingHill,
        AltitudeFlight,
        Theory,
        Level,
        Enrollment,
        Note,
        School,
        Student,
        Subscription,
        GuestSubscription,
        TeamMember,
        User
    ]
}

const dbConfig: TypeOrmModuleOptions = dbConfigBase;

export const dbTestConfig: TypeOrmModuleOptions = dbConfigBase;
