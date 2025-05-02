import { MigrationInterface, QueryRunner } from "typeorm";

export class EmergencyContact1745348152938 implements MigrationInterface {
    name = 'EmergencyContact1745348152938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "emergency_contact" ("id" SERIAL NOT NULL, "firstname" text NOT NULL, "lastname" text NOT NULL, "phone" text NOT NULL, "additional_information" text, "user_id" integer NOT NULL, CONSTRAINT "PK_922933ddef34a7e1ed99ae692ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "emergency_contact" ADD CONSTRAINT "FK_8c3b7a9e473229506023adf114f" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "emergency_contact" DROP CONSTRAINT "FK_8c3b7a9e473229506023adf114f"`);
        await queryRunner.query(`DROP TABLE "emergency_contact"`);
    }
}