import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStudentArchived1693077707698 implements MigrationInterface {
    name = 'AddStudentArchived1693077707698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_archived" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "school_id" integer, CONSTRAINT "PK_e31553a9ff6b63dbd3e9c620076" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_archived" ADD CONSTRAINT "FK_6a0616bd04377bd85cbe3ae16c4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "student_archived" ADD CONSTRAINT "FK_85fb17a853df97a4eb8a4e870af" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_archived" DROP CONSTRAINT "FK_85fb17a853df97a4eb8a4e870af"`);
        await queryRunner.query(`ALTER TABLE "student_archived" DROP CONSTRAINT "FK_6a0616bd04377bd85cbe3ae16c4"`);
        await queryRunner.query(`DROP TABLE "student_archived"`);
    }

}
