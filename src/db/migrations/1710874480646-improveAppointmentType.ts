import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveAppointmentType1710874480646 implements MigrationInterface {
    name = 'ImproveAppointmentType1710874480646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "meeting_point" character varying`);
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "max_people" integer`);
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "color" character varying`);
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "time" TIME`);
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD "instructor_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "instructor_id"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "time"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "max_people"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP COLUMN "meeting_point"`);
    }

}
