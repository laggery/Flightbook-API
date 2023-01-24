import {MigrationInterface, QueryRunner} from "typeorm";

export class schoolLanguage1667162138882 implements MigrationInterface {
    name = 'schoolLanguage1667162138882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ADD "language" character varying(2) NOT NULL DEFAULT 'de'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "language"`);
    }

}
