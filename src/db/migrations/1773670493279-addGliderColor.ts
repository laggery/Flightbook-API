import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGliderColor1773670493279 implements MigrationInterface {
    name = 'AddGliderColor1773670493279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" DROP COLUMN "color"`);
    }

}
