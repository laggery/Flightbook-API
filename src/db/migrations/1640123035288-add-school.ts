import {MigrationInterface, QueryRunner} from "typeorm";

export class addSchool1640123035288 implements MigrationInterface {
    name = 'addSchool1640123035288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "data"."team_member" ("id" SERIAL NOT NULL, "admin" boolean NOT NULL DEFAULT false, "user_id" integer, "school_id" integer, CONSTRAINT "PK_d885481d1cf32ff2ff38d6196f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "data"."school" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "address1" character varying(255) NOT NULL, "address2" character varying(255), "plz" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "phone" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_f13cab82aa76b03d34d88047c3c" UNIQUE ("name"), CONSTRAINT "PK_521f81236aa12669cafd9620250" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "data"."student" ("id" SERIAL NOT NULL, "user_id" integer, "school_id" integer, CONSTRAINT "PK_7ca2b34292227b63a053bc22ca6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "data"."team_member" ADD CONSTRAINT "FK_c82a2366243aafa33ace29ca1fb" FOREIGN KEY ("user_id") REFERENCES "data"."user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."team_member" ADD CONSTRAINT "FK_f0f2d9cc1f543c89c68b1a31f38" FOREIGN KEY ("school_id") REFERENCES "data"."school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."student" ADD CONSTRAINT "FK_a9c05971d48c05354dc56c5b298" FOREIGN KEY ("user_id") REFERENCES "data"."user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."student" ADD CONSTRAINT "FK_85c1ac8840adccc59269b57e028" FOREIGN KEY ("school_id") REFERENCES "data"."school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."student" DROP CONSTRAINT "FK_85c1ac8840adccc59269b57e028"`);
        await queryRunner.query(`ALTER TABLE "data"."student" DROP CONSTRAINT "FK_a9c05971d48c05354dc56c5b298"`);
        await queryRunner.query(`ALTER TABLE "data"."team_member" DROP CONSTRAINT "FK_f0f2d9cc1f543c89c68b1a31f38"`);
        await queryRunner.query(`ALTER TABLE "data"."team_member" DROP CONSTRAINT "FK_c82a2366243aafa33ace29ca1fb"`);
        await queryRunner.query(`DROP TABLE "data"."student"`);
        await queryRunner.query(`DROP TABLE "data"."school"`);
        await queryRunner.query(`DROP TABLE "data"."team_member"`);
    }

}
