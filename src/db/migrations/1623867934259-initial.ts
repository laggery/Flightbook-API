import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1623867934259 implements MigrationInterface {
    name = 'initial1623867934259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS data`);
        await queryRunner.query(`CREATE TABLE "data"."place" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "name" character varying(40) NOT NULL, "altitude" integer, CONSTRAINT "PK_258e361dec8c1195f66ad2d671f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_16406_user_id" ON "data"."place" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16603_user_id" ON "data"."place" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16603_primary" ON "data"."place" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16406_primary" ON "data"."place" ("id") `);
        await queryRunner.query(`CREATE TABLE "data"."user" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "username_canonical" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "email_canonical" character varying(255) NOT NULL, "enabled" boolean NOT NULL, "salt" character varying(255), "password" character varying(255) NOT NULL, "last_login" TIMESTAMP WITH TIME ZONE, "locked" boolean, "expired" boolean, "expires_at" TIMESTAMP WITH TIME ZONE, "confirmation_token" character varying(255), "password_requested_at" TIMESTAMP WITH TIME ZONE, "roles" text NOT NULL, "credentials_expired" boolean, "credentials_expire_at" TIMESTAMP WITH TIME ZONE, "firstname" character varying(30) NOT NULL, "lastname" character varying(30) NOT NULL, "token" character varying(60), CONSTRAINT "PK_03b91d2b8321aa7ba32257dc321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_idx_ed85f2a29d842b9b0dfefaba34" ON "data"."user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_idx_ed85f2a29d842b9b0dfefaba34" ON "data"."user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_uniq_8d93d64992fc23a8" ON "data"."user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_uniq_8d93d64992fc23a8" ON "data"."user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_primary" ON "data"."user" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_primary" ON "data"."user" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_uniq_8d93d649a0d96fbf" ON "data"."user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_idx_846d5513f58dc765ecc299582a" ON "data"."user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_uniq_8d93d649a0d96fbf" ON "data"."user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_idx_846d5513f58dc765ecc299582a" ON "data"."user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_email" ON "data"."user" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_email" ON "data"."user" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_idx_e12875dfb3b1d92d7d7c5377e2" ON "data"."user" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_idx_e12875dfb3b1d92d7d7c5377e2" ON "data"."user" ("email") `);
        await queryRunner.query(`CREATE TABLE "data"."glider" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "buy_date" date, "brand" character varying(30) NOT NULL, "name" character varying(30) NOT NULL, "tandem" boolean NOT NULL DEFAULT false, "nbFlights" integer, "time" integer, CONSTRAINT "PK_08b714a92ba1525b31ecff7d60c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_16593_user_id" ON "data"."glider" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16396_user_id" ON "data"."glider" ("user_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16396_primary" ON "data"."glider" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16593_primary" ON "data"."glider" ("id") `);
        await queryRunner.query(`CREATE TABLE "data"."flight" ("id" SERIAL NOT NULL, "glider_id" integer NOT NULL, "start_id" integer, "landing_id" integer, "user_id" integer NOT NULL, "date" date, "time" TIME, "description" character varying(2000), "price" double precision, "km" integer, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_3162f30d78a40fb70862c38012c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_16389_user_id" ON "data"."flight" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16586_user_id" ON "data"."flight" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16389_start_id" ON "data"."flight" ("start_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16586_start_id" ON "data"."flight" ("start_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16586_landing_id" ON "data"."flight" ("landing_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16389_landing_id" ON "data"."flight" ("landing_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16586_primary" ON "data"."flight" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16389_primary" ON "data"."flight" ("id") `);
        await queryRunner.query(`CREATE INDEX "idx_16586_glider_id" ON "data"."flight" ("glider_id") `);
        await queryRunner.query(`CREATE INDEX "idx_16389_glider_id" ON "data"."flight" ("glider_id") `);
        await queryRunner.query(`CREATE TABLE "data"."news" ("id" SERIAL NOT NULL, "date" date NOT NULL, "title" character varying(40) NOT NULL, "text" text NOT NULL, "language" character varying(4) NOT NULL, CONSTRAINT "PK_6952fa54e94d8c173b9c562f067" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16597_primary" ON "data"."news" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16400_primary" ON "data"."news" ("id") `);
        await queryRunner.query(`ALTER TABLE "data"."place" ADD CONSTRAINT "FK_9fc0012ac9ba524ad1ff9fcd476" FOREIGN KEY ("user_id") REFERENCES "data"."user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."glider" ADD CONSTRAINT "FK_488f52a7113733d72419d954368" FOREIGN KEY ("user_id") REFERENCES "data"."user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."flight" ADD CONSTRAINT "FK_0fc6e13057b8e23f8293b909d9c" FOREIGN KEY ("glider_id") REFERENCES "data"."glider"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."flight" ADD CONSTRAINT "FK_fa0d02650d9ea2b4b92887782c6" FOREIGN KEY ("landing_id") REFERENCES "data"."place"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."flight" ADD CONSTRAINT "FK_004ba6abb3df28176e5101a16f1" FOREIGN KEY ("start_id") REFERENCES "data"."place"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "data"."flight" ADD CONSTRAINT "FK_bc027109ad4c8ce3f5849423f71" FOREIGN KEY ("user_id") REFERENCES "data"."user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "data"."flight" DROP CONSTRAINT "FK_bc027109ad4c8ce3f5849423f71"`);
        await queryRunner.query(`ALTER TABLE "data"."flight" DROP CONSTRAINT "FK_004ba6abb3df28176e5101a16f1"`);
        await queryRunner.query(`ALTER TABLE "data"."flight" DROP CONSTRAINT "FK_fa0d02650d9ea2b4b92887782c6"`);
        await queryRunner.query(`ALTER TABLE "data"."flight" DROP CONSTRAINT "FK_0fc6e13057b8e23f8293b909d9c"`);
        await queryRunner.query(`ALTER TABLE "data"."glider" DROP CONSTRAINT "FK_488f52a7113733d72419d954368"`);
        await queryRunner.query(`ALTER TABLE "data"."place" DROP CONSTRAINT "FK_9fc0012ac9ba524ad1ff9fcd476"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16400_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16597_primary"`);
        await queryRunner.query(`DROP TABLE "data"."news"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16389_glider_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16586_glider_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16389_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16586_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16389_landing_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16586_landing_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16586_start_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16389_start_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16586_user_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16389_user_id"`);
        await queryRunner.query(`DROP TABLE "data"."flight"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16593_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16396_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16396_user_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16593_user_id"`);
        await queryRunner.query(`DROP TABLE "data"."glider"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_idx_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_idx_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_email"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_email"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_idx_846d5513f58dc765ecc299582a"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_uniq_8d93d649a0d96fbf"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_idx_846d5513f58dc765ecc299582a"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_uniq_8d93d649a0d96fbf"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_uniq_8d93d64992fc23a8"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_uniq_8d93d64992fc23a8"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16606_idx_ed85f2a29d842b9b0dfefaba34"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16409_idx_ed85f2a29d842b9b0dfefaba34"`);
        await queryRunner.query(`DROP TABLE "data"."user"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16406_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16603_primary"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16603_user_id"`);
        await queryRunner.query(`DROP INDEX "data"."idx_16406_user_id"`);
        await queryRunner.query(`DROP TABLE "data"."place"`);
    }

}
