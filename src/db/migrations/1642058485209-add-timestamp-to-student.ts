import {MigrationInterface, QueryRunner} from "typeorm";

export class addTimestampToStudent1642058485209 implements MigrationInterface {
    name = 'addTimestampToStudent1642058485209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."student" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."student" DROP COLUMN "timestamp"`);
    }

}
