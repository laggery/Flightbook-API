import { MigrationInterface, QueryRunner } from "typeorm";

export class AppointmentDeadline1764529271313 implements MigrationInterface {
    name = 'AppointmentDeadline1764529271313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "deadline_offset_hours" integer`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "deadline" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "deadline"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "deadline_offset_hours"`);
    }

}
