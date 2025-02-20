import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTimestamp1739810353266 implements MigrationInterface {
    name = 'UserTimestamp1739810353266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" ADD "created_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "app_user" ADD "validated_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "validated_at"`);
    }

}
