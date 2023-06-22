import { MigrationInterface, QueryRunner } from "typeorm";

export class PlaceCoordinates1687205233274 implements MigrationInterface {
    name = 'PlaceCoordinates1687205233274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" ADD "coordinates" geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "coordinates"`);
    }

}
