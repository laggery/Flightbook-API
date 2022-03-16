import {MigrationInterface, QueryRunner} from "typeorm";

export class cleanUserEntity1647288632667 implements MigrationInterface {
    name = 'cleanUserEntity1647288632667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_16409_idx_846d5513f58dc765ecc299582a"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16409_idx_ed85f2a29d842b9b0dfefaba34"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16409_uniq_8d93d64992fc23a8"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16409_uniq_8d93d649a0d96fbf"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16606_idx_846d5513f58dc765ecc299582a"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16606_idx_ed85f2a29d842b9b0dfefaba34"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16606_uniq_8d93d64992fc23a8"`);
        await queryRunner.query(`DROP INDEX "public"."idx_16606_uniq_8d93d649a0d96fbf"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username_canonical"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_canonical"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "enabled"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "locked"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expired"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "roles"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credentials_expired"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "credentials_expire_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "credentials_expire_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "credentials_expired" boolean`);
        await queryRunner.query(`ALTER TABLE "user" ADD "roles" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expired" boolean`);
        await queryRunner.query(`ALTER TABLE "user" ADD "locked" boolean`);
        await queryRunner.query(`ALTER TABLE "user" ADD "enabled" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_canonical" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username_canonical" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_uniq_8d93d649a0d96fbf" ON "user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_uniq_8d93d64992fc23a8" ON "user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_idx_ed85f2a29d842b9b0dfefaba34" ON "user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16606_idx_846d5513f58dc765ecc299582a" ON "user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_uniq_8d93d649a0d96fbf" ON "user" ("email_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_uniq_8d93d64992fc23a8" ON "user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_idx_ed85f2a29d842b9b0dfefaba34" ON "user" ("username_canonical") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_16409_idx_846d5513f58dc765ecc299582a" ON "user" ("email_canonical") `);
    }

}
