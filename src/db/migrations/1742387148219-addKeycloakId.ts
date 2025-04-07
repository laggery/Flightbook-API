import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKeycloakId1742387148219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app_user" ADD COLUMN IF NOT EXISTS "keycloak_id" text NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "app_user" DROP COLUMN "keycloak_id"`);
  }
}
