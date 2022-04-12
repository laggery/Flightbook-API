import {MigrationInterface, QueryRunner} from "typeorm";

export class addPlaceCountry1649521520636 implements MigrationInterface {
    name = 'addPlaceCountry1649521520636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" ADD "country" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "country"`);
    }

}
