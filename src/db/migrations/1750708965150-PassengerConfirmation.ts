import { MigrationInterface, QueryRunner } from "typeorm";

export class PassengerConfirmation1750708965150 implements MigrationInterface {
    name = 'PassengerConfirmation1750708965150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "passenger_confirmation" ("id" SERIAL NOT NULL, "firstname" text NOT NULL, "lastname" text NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "place" text NOT NULL, "date" date NOT NULL, "signature" text NOT NULL, "signature_mime_type" text NOT NULL, "validation" jsonb NOT NULL, "can_use_data" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_41cbe895b013d0378cd0d98ab58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" ADD CONSTRAINT "FK_bfc30247f633d12cc4852224a78" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" DROP CONSTRAINT "FK_bfc30247f633d12cc4852224a78"`);
        await queryRunner.query(`DROP TABLE "passenger_confirmation"`);
    }

}
