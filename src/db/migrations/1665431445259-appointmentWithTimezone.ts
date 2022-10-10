import {MigrationInterface, QueryRunner} from "typeorm";

export class appointmentWithTimezone1665431445259 implements MigrationInterface {
    name = 'appointmentWithTimezone1665431445259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "scheduling" type TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "scheduling" type TIMESTAMP`);
    }

}
