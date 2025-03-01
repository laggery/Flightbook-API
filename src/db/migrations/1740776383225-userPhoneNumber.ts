import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPhoneNumber1740776383225 implements MigrationInterface {
    name = 'UserPhoneNumber1740776383225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" ADD "phone" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "phone"`);
    }

}
