import { MigrationInterface, QueryRunner } from "typeorm";

export class ControlSheetLevel1716497063909 implements MigrationInterface {
    name = 'ControlSheetLevel1716497063909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "level" ("id" SERIAL NOT NULL, "start" smallint NOT NULL DEFAULT '0', "maneuver" smallint NOT NULL DEFAULT '0', "landing" smallint NOT NULL DEFAULT '0', CONSTRAINT "PK_d3f1a7a6f09f1c3144bacdc6bcc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD "levelId" integer`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "UQ_e6dafd1a24b8d2fa531b6a24f9a" UNIQUE ("levelId")`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "FK_e6dafd1a24b8d2fa531b6a24f9a" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "FK_e6dafd1a24b8d2fa531b6a24f9a"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "UQ_e6dafd1a24b8d2fa531b6a24f9a"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP COLUMN "levelId"`);
        await queryRunner.query(`DROP TABLE "level"`);
    }

}
