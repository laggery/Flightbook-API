import {MigrationInterface, QueryRunner} from "typeorm";

export class enabledUser1652473107555 implements MigrationInterface {
    name = 'enabledUser1652473107555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "enabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`);
    }

}
