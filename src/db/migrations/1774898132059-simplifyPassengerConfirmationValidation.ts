import { MigrationInterface, QueryRunner } from "typeorm";

export class SimplifyPassengerConfirmationValidation1774898132059 implements MigrationInterface {
    name = 'SimplifyPassengerConfirmationValidation1774898132059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new validated column
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" ADD "validated" boolean NOT NULL DEFAULT false`);
        
        // Migrate existing data: set validated = true if all 4 validation fields were true
        await queryRunner.query(`
            UPDATE "passenger_confirmation" 
            SET "validated" = (
                (validation->>'fullyUnderstoodInstructions')::boolean = true AND
                (validation->>'undertakePilotInstructions')::boolean = true AND
                (validation->>'noHealthProblems')::boolean = true AND
                (validation->>'understandRisks')::boolean = true
            )
        `);
        
        // Drop old validation column
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" DROP COLUMN "validation"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back validation column
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" ADD "validation" jsonb NOT NULL DEFAULT '{}'`);
        
        // Migrate data back: if validated is true, set all validation fields to true
        await queryRunner.query(`
            UPDATE "passenger_confirmation" 
            SET "validation" = CASE 
                WHEN "validated" = true THEN 
                    '{"fullyUnderstoodInstructions": true, "undertakePilotInstructions": true, "noHealthProblems": true, "understandRisks": true}'::jsonb
                ELSE 
                    '{"fullyUnderstoodInstructions": false, "undertakePilotInstructions": false, "noHealthProblems": false, "understandRisks": false}'::jsonb
            END
        `);
        
        // Drop validated column
        await queryRunner.query(`ALTER TABLE "passenger_confirmation" DROP COLUMN "validated"`);
    }

}
