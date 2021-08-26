import {MigrationInterface, QueryRunner} from "typeorm";

export class igcUpload1629666783591 implements MigrationInterface {
    name = 'igcUpload1629666783591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight" ADD "igc_filepath" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."flight" DROP COLUMN "igc_filepath"`);
    }

}
