import { MigrationInterface, QueryRunner } from "typeorm";

export class ShvFlightAlone1701276252473 implements MigrationInterface {
    name = 'ShvFlightAlone1701276252473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" ADD "shv_alone" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "shv_alone"`);
    }

}
