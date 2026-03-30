import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractSchoolConfiguration1774891025891 implements MigrationInterface {
    name = 'ContractSchoolConfiguration1774891025891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "configuration_user_can_edit_controlsheet"`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "configuration_validate_flights"`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "configuration_tandem"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ADD "configuration_tandem" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "school" ADD "configuration_validate_flights" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "school" ADD "configuration_user_can_edit_controlsheet" boolean NOT NULL DEFAULT true`);
    }

}
