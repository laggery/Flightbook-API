import { MigrationInterface, QueryRunner } from "typeorm";

export class TandemPilot1770067483498 implements MigrationInterface {
    name = 'TandemPilot1770067483498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tandem_pilot" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isArchived" boolean NOT NULL DEFAULT false, "user_id" integer, "school_id" integer, CONSTRAINT "PK_cfa1f0e7be38e445ce81e90247b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_payment_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_id" integer`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_payment_state" character varying(25)`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_payment_comment" text`);
        await queryRunner.query(`ALTER TABLE "flight" ADD "tandem_school_payment_timestamp" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" ADD "tandem_school_id" integer`);
        await queryRunner.query(`ALTER TABLE "tandem_pilot" ADD CONSTRAINT "FK_db5a01fbe8df26354f16f258b33" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "tandem_pilot" ADD CONSTRAINT "FK_249065238193b0df49f0534995a" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_22c7edf9de91a880b91f8063f69" FOREIGN KEY ("tandem_school_payment_user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "flight" ADD CONSTRAINT "FK_13445716706f1df941bfd81245b" FOREIGN KEY ("tandem_school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" ADD CONSTRAINT "FK_b6b1fbe2f2e9520a52af95a3caa" FOREIGN KEY ("tandem_school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" DROP CONSTRAINT "FK_b6b1fbe2f2e9520a52af95a3caa"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_13445716706f1df941bfd81245b"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP CONSTRAINT "FK_22c7edf9de91a880b91f8063f69"`);
        await queryRunner.query(`ALTER TABLE "tandem_pilot" DROP CONSTRAINT "FK_249065238193b0df49f0534995a"`);
        await queryRunner.query(`ALTER TABLE "tandem_pilot" DROP CONSTRAINT "FK_db5a01fbe8df26354f16f258b33"`);
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" DROP COLUMN "tandem_school_id"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_payment_timestamp"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_payment_comment"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_payment_state"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_id"`);
        await queryRunner.query(`ALTER TABLE "flight" DROP COLUMN "tandem_school_payment_user_id"`);
        await queryRunner.query(`DROP TABLE "tandem_pilot"`);
    }

}
