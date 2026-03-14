import { MigrationInterface, QueryRunner } from "typeorm";

export class TandemPaymentAmount1773164668607 implements MigrationInterface {
    name = 'TandemPaymentAmount1773164668607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_payment_amount" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_payment_amount"`);
    }

}
