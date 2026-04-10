import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleCalendarIntegration1775101486000 implements MigrationInterface {
    name = 'AddGoogleCalendarIntegration1775101486000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add google_calendar_event_id column to appointment table
        await queryRunner.query(`
            ALTER TABLE "appointment" 
            ADD COLUMN "google_calendar_event_id" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove google_calendar_event_id column from appointment table
        await queryRunner.query(`
            ALTER TABLE "appointment" 
            DROP COLUMN "google_calendar_event_id"
        `);
    }
}
