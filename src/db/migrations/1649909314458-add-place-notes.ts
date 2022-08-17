import {MigrationInterface, QueryRunner} from "typeorm";

export class addPlaceNotes1649909314458 implements MigrationInterface {
    name = 'addPlaceNotes1649909314458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" ADD "notes" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "notes"`);
    }

}
