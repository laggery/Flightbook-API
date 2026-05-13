import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTandemSchoolCustomValues1777126807000 implements MigrationInterface {
    name = 'AddTandemSchoolCustomValues1777126807000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_custom_values" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_custom_values"`);
    }
}
