import { MigrationInterface, QueryRunner } from "typeorm";

export class addGuestSubscription1686240595890 implements MigrationInterface {
    name = 'addGuestSubscription1686240595890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "guest_subscription" ("id" SERIAL NOT NULL, "firstname" character varying(30) NOT NULL, "lastname" character varying(30) NOT NULL, "appointment_id" integer, CONSTRAINT "PK_0d9d64951a5decda4d5b2980c62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "guest_subscription" ADD CONSTRAINT "FK_f225d8df2148603bf64f1704c3f" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "guest_subscription" DROP CONSTRAINT "FK_f225d8df2148603bf64f1704c3f"`);
        await queryRunner.query(`DROP TABLE "guest_subscription"`);
    }

}
