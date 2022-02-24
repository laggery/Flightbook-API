import {MigrationInterface, QueryRunner} from "typeorm";

export class addArchivedGlider1645039410251 implements MigrationInterface {
    name = 'addArchivedGlider1645039410251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" ADD "archived" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" DROP COLUMN "archived"`);
    }

}
