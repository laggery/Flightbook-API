import { MigrationInterface, QueryRunner } from "typeorm";

export class ControlSheetPassExam1753478072507 implements MigrationInterface {
    name = 'ControlSheetPassExam1753478072507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD "pass_theory_exam" date`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD "pass_practice_exam" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP COLUMN "pass_practice_exam"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP COLUMN "pass_theory_exam"`);
    }

}
