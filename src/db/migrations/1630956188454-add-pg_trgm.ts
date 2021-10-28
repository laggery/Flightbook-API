import {MigrationInterface, QueryRunner} from "typeorm";

export class addPgTrgm1630956188454 implements MigrationInterface {
    name = 'addPgTrgm1630956188454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create extension if not exists pg_trgm`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop extension if exists pg_trgm`);
    }

}
