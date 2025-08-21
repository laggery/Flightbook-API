import { MigrationInterface, QueryRunner } from "typeorm";

export class UserConfig1755441595712 implements MigrationInterface {
    name = 'UserConfig1755441595712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" ADD "config" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "config"`);
    }

}
