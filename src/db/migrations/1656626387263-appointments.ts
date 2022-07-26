import {MigrationInterface, QueryRunner} from "typeorm";

export class appointments1656626387263 implements MigrationInterface {
    name = 'appointments1656626387263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "comment" character varying(2000), "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "appointment_id" integer, "user_id" integer, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "scheduling" TIMESTAMP NOT NULL, "meeting_point" character varying NOT NULL, "max_people" integer NOT NULL, "description" character varying(2000), "state" character varying(25) NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "school_id" integer, "instructor_id" integer, "takeoff_coordinator_id" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_272e4a985a9501e0babe95cf0e0" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_940d49a105d50bbd616be540013" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_e51f9b8daf006e4bb123d0c5000" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_246ab9c7af4e2d7cf04c5f88913" FOREIGN KEY ("instructor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_74eb2d484d75ec2173e733adf75" FOREIGN KEY ("takeoff_coordinator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_74eb2d484d75ec2173e733adf75"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_246ab9c7af4e2d7cf04c5f88913"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_e51f9b8daf006e4bb123d0c5000"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_940d49a105d50bbd616be540013"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_272e4a985a9501e0babe95cf0e0"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
    }

}
