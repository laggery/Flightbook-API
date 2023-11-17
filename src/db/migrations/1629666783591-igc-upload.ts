import {MigrationInterface, QueryRunner} from "typeorm";

export class igcUpload1629666783591 implements MigrationInterface {
    name = 'igcUpload1629666783591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."flight" ADD "igc" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."flight" DROP COLUMN "igc"`);
    }

}
