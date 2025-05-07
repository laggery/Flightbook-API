import { MigrationInterface, QueryRunner } from "typeorm";

export class FlightValidation1746480625254 implements MigrationInterface {
    name = 'FlightValidation1746480625254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" RENAME COLUMN "user_can_edit_controlsheet" TO "configuration_user_can_edit_controlsheet"`);
        await queryRunner.query(`ALTER TABLE "school" ADD "configuration_validate_flights" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "validation_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "validation_school_id" integer`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "validation_timestamp" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_65aa8604d2d7e486a620d520ae6" FOREIGN KEY ("validation_user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_970cacc0dd0df155ee5e5b401c1" FOREIGN KEY ("validation_school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_970cacc0dd0df155ee5e5b401c1"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_65aa8604d2d7e486a620d520ae6"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "validation_timestamp"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "validation_school_id"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "validation_user_id"`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "configuration_validate_flights"`);
        await queryRunner.query(`ALTER TABLE "school" RENAME COLUMN "configuration_user_can_edit_controlsheet" TO "user_can_edit_controlsheet"`);
    }
}
