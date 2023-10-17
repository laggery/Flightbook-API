import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrateUserTable1697573434511 implements MigrationInterface {
    name = 'MigrateUserTable1697573434511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "app_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_user" RENAME TO "user"`);
    }

}
