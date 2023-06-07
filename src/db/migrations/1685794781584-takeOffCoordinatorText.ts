import { MigrationInterface, QueryRunner } from "typeorm";

export class takeOffCoordinatorText1685794781584 implements MigrationInterface {
    name = 'takeOffCoordinatorText1685794781584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "takeoff_coordinator" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "takeoff_coordinator"`);
    }

}
