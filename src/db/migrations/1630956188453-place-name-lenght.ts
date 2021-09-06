import {MigrationInterface, QueryRunner} from "typeorm";

export class placeNameLenght1630956188453 implements MigrationInterface {
    name = 'placeNameLenght1630956188453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."place" ALTER COLUMN "name" TYPE character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."place" ALTER COLUMN "name" TYPE character varying(40)`);
    }

}
