import {MigrationInterface, QueryRunner} from "typeorm";

export class notificationToken1667162138861 implements MigrationInterface {
    name = 'notificationToken1667162138861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "notification_token" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notification_token"`);
    }

}
