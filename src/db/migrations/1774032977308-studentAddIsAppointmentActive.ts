import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentAddIsAppointmentActive1774032977308 implements MigrationInterface {
    name = 'StudentAddIsAppointmentActive1774032977308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "isAppointmentActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isAppointmentActive"`);
    }

}
