import { MigrationInterface, QueryRunner } from "typeorm";

export class TandemSchoolConfiguration1773262582685 implements MigrationInterface {
    name = 'TandemSchoolConfiguration1773262582685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ADD "configuration_tandem" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "configuration_tandem"`);
    }

}
