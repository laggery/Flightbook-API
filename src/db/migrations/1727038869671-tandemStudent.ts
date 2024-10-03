import { MigrationInterface, QueryRunner } from "typeorm";

export class TandemStudent1727038869671 implements MigrationInterface {
    name = 'TandemStudent1727038869671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" ADD "isTandem" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isTandem"`);
    }

}
