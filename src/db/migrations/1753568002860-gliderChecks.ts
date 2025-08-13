import { MigrationInterface, QueryRunner } from "typeorm";

export class GliderChecks1753568002860 implements MigrationInterface {
    name = 'GliderChecks1753568002860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" ADD "checks" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glider" DROP COLUMN "checks"`);
    }

}
