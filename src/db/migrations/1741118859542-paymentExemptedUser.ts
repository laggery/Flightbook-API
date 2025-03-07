import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentExemptedUser1741118859542 implements MigrationInterface {
    name = 'PaymentExemptedUser1741118859542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" ADD "payment_exempted" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "payment_exempted"`);
    }

}
