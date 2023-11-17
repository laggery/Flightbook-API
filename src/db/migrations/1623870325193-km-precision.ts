import {MigrationInterface, QueryRunner} from "typeorm";

export class kmPrecision1623870325193 implements MigrationInterface {
    name = 'kmPrecision1623870325193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."flight" ALTER COLUMN "km" type double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."flight" ALTER COLUMN "km" type integer`);
    }

}
