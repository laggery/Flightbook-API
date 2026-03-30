import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorSchoolConfig1774463609592 implements MigrationInterface {
    name = 'RefactorSchoolConfig1774463609592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ADD "config" jsonb`);
        
        // Migrate existing configuration data to the new config JSONB column
        await queryRunner.query(`
            UPDATE "school"
            SET "config" = jsonb_build_object(
                'schoolModule', jsonb_build_object(
                    'active', true,
                    'validateFlights', "configuration_validate_flights",
                    'userCanEditControlSheet', "configuration_user_can_edit_controlsheet"
                ),
                'tandemModule', jsonb_build_object(
                    'active', "configuration_tandem"
                )
            )
            WHERE "config" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" DROP COLUMN "config"`);
    }

}
