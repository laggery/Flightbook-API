import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIsAppointmentActiveForArchivedStudents1774032977310 implements MigrationInterface {
    name = 'UpdateIsAppointmentActiveForArchivedStudents1774032977310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE data.student SET "isAppointmentActive" = false WHERE "isArchived" = true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
