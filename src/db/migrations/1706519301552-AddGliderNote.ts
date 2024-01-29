import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGliderNote1706519301552 implements MigrationInterface {
    name = 'AddGliderNote1706519301552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" ADD "note" character varying(2000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" DROP COLUMN "note"`);
    }

}
