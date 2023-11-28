import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorArchivedStudent1701032929830 implements MigrationInterface {
    name = 'RefactorArchivedStudent1701032929830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_ffbf8dd927ddff0f72b476e3ea1"`);
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "archivedstudent_id"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "isArchived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "timestamp" SET DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "student_archived";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS data.student_archived
        (
            id integer NOT NULL DEFAULT nextval('student_archived_id_seq'::regclass),
            "timestamp" timestamp with time zone NOT NULL DEFAULT now(),
            user_id integer,
            school_id integer,
            CONSTRAINT "PK_e31553a9ff6b63dbd3e9c620076" PRIMARY KEY (id),
            CONSTRAINT "FK_6a0616bd04377bd85cbe3ae16c4" FOREIGN KEY (user_id)
                REFERENCES data.app_user (id) MATCH SIMPLE
                ON UPDATE RESTRICT
                ON DELETE RESTRICT,
            CONSTRAINT "FK_85fb17a853df97a4eb8a4e870af" FOREIGN KEY (school_id)
                REFERENCES data.school (id) MATCH SIMPLE
                ON UPDATE RESTRICT
                ON DELETE RESTRICT
        )`);
        await queryRunner.query(`ALTER TABLE "student" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "isArchived"`);
        await queryRunner.query(`ALTER TABLE "note" ADD "archivedstudent_id" integer`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_ffbf8dd927ddff0f72b476e3ea1" FOREIGN KEY ("archivedstudent_id") REFERENCES "student_archived"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

}
