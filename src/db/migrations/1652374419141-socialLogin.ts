import {MigrationInterface, QueryRunner} from "typeorm";

export class socialLogin1652374419141 implements MigrationInterface {
    name = 'socialLogin1652374419141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "login_type" character varying(25) NOT NULL DEFAULT 'LOCAL'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "sociallogin_id" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sociallogin_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "login_type"`);
    }

}
