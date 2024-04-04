import { MigrationInterface, QueryRunner } from "typeorm";

export class FreeStudent1712207675263 implements MigrationInterface {
    name = 'FreeStudent1712207675263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollment" ADD "is_free" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollment" DROP COLUMN "is_free"`);
    }

}
