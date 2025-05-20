import { MigrationInterface, QueryRunner } from "typeorm";

export class FlightValidationState1746905996693 implements MigrationInterface {
    name = 'FlightValidationState1746905996693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" ADD "validation_state" character varying(25)`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "validation_comment" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "validation_comment"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "validation_state"`);
    }

}
