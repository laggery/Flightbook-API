import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotes1700917914509 implements MigrationInterface {
    name = 'AddNotes1700917914509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "title" character varying(150), "text" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "student_id" integer, "archivedstudent_id" integer, CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_962e4669a8feda6eb81be000de1" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_ffbf8dd927ddff0f72b476e3ea1" FOREIGN KEY ("archivedstudent_id") REFERENCES "student_archived"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_ffbf8dd927ddff0f72b476e3ea1"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_962e4669a8feda6eb81be000de1"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
