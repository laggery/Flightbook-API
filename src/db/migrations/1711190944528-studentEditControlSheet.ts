import { MigrationInterface, QueryRunner } from "typeorm";

export class StudentEditControlSheet1711190944528 implements MigrationInterface {
    name = 'StudentEditControlSheet1711190944528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD "user_can_edit" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "school" ADD "user_can_edit_controlsheet" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP COLUMN "user_can_edit"`);
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "user_can_edit_controlsheet"`);
    }

}
