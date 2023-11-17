import {MigrationInterface, QueryRunner} from "typeorm";

export class enrollmentTable1642365825289 implements MigrationInterface {
    name = 'enrollmentTable1642365825289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data"."enrollment" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "token" character varying(45) NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL, "type" character varying(25) NOT NULL, "school_id" integer, CONSTRAINT "PK_ddbed8ac4b8c5f6bc7919912d3f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "data"."enrollment" ADD CONSTRAINT "FK_f94e05b7bb68b3cb3f168c3ecb3" FOREIGN KEY ("school_id") REFERENCES "data"."school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."enrollment" DROP CONSTRAINT "FK_f94e05b7bb68b3cb3f168c3ecb3"`);
        await queryRunner.query(`DROP TABLE "data"."enrollment"`);
    }

}
