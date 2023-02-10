import { MigrationInterface, QueryRunner } from "typeorm";

export class appointmentType1674847866663 implements MigrationInterface {
    name = 'appointmentType1674847866663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT false, "school_id" integer, CONSTRAINT "PK_c2c6d743b2dc3aa4b46f4cb99f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD "appointment_type_id" integer`);
        await queryRunner.query(`ALTER TABLE "appointment_type" ADD CONSTRAINT "FK_f3daa236bac419cac73a3136197" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_e4c1d6ea2eca63647be8b9d9622" FOREIGN KEY ("appointment_type_id") REFERENCES "appointment_type"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_e4c1d6ea2eca63647be8b9d9622"`);
        await queryRunner.query(`ALTER TABLE "appointment_type" DROP CONSTRAINT "FK_f3daa236bac419cac73a3136197"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "appointment_type_id"`);
        await queryRunner.query(`DROP TABLE "appointment_type"`);
    }
}
