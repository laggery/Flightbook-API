import { MigrationInterface, QueryRunner } from "typeorm";

export class MeetingpointNullable1710443617619 implements MigrationInterface {
    name = 'MeetingpointNullable1710443617619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "meeting_point" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "meeting_point" SET NOT NULL`);
    }
}
