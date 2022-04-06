import {MigrationInterface, QueryRunner} from "typeorm";

export class controlSheet1648242765907 implements MigrationInterface {
    name = 'controlSheet1648242765907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "altitude_flight" ("id" SERIAL NOT NULL, "tandem" boolean NOT NULL DEFAULT false, "notlandung" boolean NOT NULL DEFAULT false, "startplatzwahl" boolean NOT NULL DEFAULT false, "aufziehen" boolean NOT NULL DEFAULT false, "kreise" boolean NOT NULL DEFAULT false, "richtungswechsel" boolean NOT NULL DEFAULT false, "acht" boolean NOT NULL DEFAULT false, "engekreise" boolean NOT NULL DEFAULT false, "sackflug" boolean NOT NULL DEFAULT false, "geschwBereich" boolean NOT NULL DEFAULT false, "beschlunigung" boolean NOT NULL DEFAULT false, "negativsteuerung" boolean NOT NULL DEFAULT false, "gewichtsverlagerung" boolean NOT NULL DEFAULT false, "traggurten" boolean NOT NULL DEFAULT false, "pendeln" boolean NOT NULL DEFAULT false, "rollen" boolean NOT NULL DEFAULT false, "klappen" boolean NOT NULL DEFAULT false, "ohren" boolean NOT NULL DEFAULT false, "bStall" boolean NOT NULL DEFAULT false, "spirale" boolean NOT NULL DEFAULT false, "instrumente" boolean NOT NULL DEFAULT false, "soaring" boolean NOT NULL DEFAULT false, "thermik" boolean NOT NULL DEFAULT false, "landevolte" boolean NOT NULL DEFAULT false, "punktlandung" boolean NOT NULL DEFAULT false, "rueckenwindlandung" boolean NOT NULL DEFAULT false, "traggurtenLandung" boolean NOT NULL DEFAULT false, "hanglandung" boolean NOT NULL DEFAULT false, "touchAndGo" boolean NOT NULL DEFAULT false, "examProgramme" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8721b86bc1cea0c0cf56002f613" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "theory" ("id" SERIAL NOT NULL, "fluglehre" boolean NOT NULL DEFAULT false, "wetterkunde" boolean NOT NULL DEFAULT false, "flugpraxis" boolean NOT NULL DEFAULT false, "gesetzgebung" boolean NOT NULL DEFAULT false, "materialkunde" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_505f1ea8b82da1b0a495fd51a09" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "training_hill" ("id" SERIAL NOT NULL, "auslegen" boolean NOT NULL DEFAULT false, "aufziehen" boolean NOT NULL DEFAULT false, "slalom" boolean NOT NULL DEFAULT false, "laufen_angebremst" boolean NOT NULL DEFAULT false, "vorbereitung" boolean NOT NULL DEFAULT false, "startphasen" boolean NOT NULL DEFAULT false, "richtungsaenderungen" boolean NOT NULL DEFAULT false, "startabbruch" boolean NOT NULL DEFAULT false, "seitenwindstart" boolean NOT NULL DEFAULT false, "schlechtAusgelegt" boolean NOT NULL DEFAULT false, "starts" boolean NOT NULL DEFAULT false, "landungen" boolean NOT NULL DEFAULT false, "notlandung" boolean NOT NULL DEFAULT false, "notschirm" boolean NOT NULL DEFAULT false, "kurven" boolean NOT NULL DEFAULT false, "entwirren" boolean NOT NULL DEFAULT false, "faltmethoden" boolean NOT NULL DEFAULT false, "theorietest" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9c52243a07a162555fe307607e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "control_sheet" ("id" SERIAL NOT NULL, "user_id" integer, "trainingHillId" integer, "theoryId" integer, "altitudeFlightId" integer, CONSTRAINT "REL_bfb86f0eae1d15aabec97ce2c7" UNIQUE ("trainingHillId"), CONSTRAINT "REL_dc3cc2c7a02f7cde34411aa017" UNIQUE ("theoryId"), CONSTRAINT "REL_d01a39d7e74fe3f889bb9940db" UNIQUE ("altitudeFlightId"), CONSTRAINT "PK_858812dbd1247bd3a404a31ca45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "FK_cf3d0e118eb16b0efc6aa0b9944" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "FK_bfb86f0eae1d15aabec97ce2c73" FOREIGN KEY ("trainingHillId") REFERENCES "training_hill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "FK_dc3cc2c7a02f7cde34411aa0176" FOREIGN KEY ("theoryId") REFERENCES "theory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "control_sheet" ADD CONSTRAINT "FK_d01a39d7e74fe3f889bb9940dbe" FOREIGN KEY ("altitudeFlightId") REFERENCES "altitude_flight"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "FK_d01a39d7e74fe3f889bb9940dbe"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "FK_dc3cc2c7a02f7cde34411aa0176"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "FK_bfb86f0eae1d15aabec97ce2c73"`);
        await queryRunner.query(`ALTER TABLE "control_sheet" DROP CONSTRAINT "FK_cf3d0e118eb16b0efc6aa0b9944"`);
        await queryRunner.query(`DROP TABLE "control_sheet"`);
        await queryRunner.query(`DROP TABLE "training_hill"`);
        await queryRunner.query(`DROP TABLE "theory"`);
        await queryRunner.query(`DROP TABLE "altitude_flight"`);
    }

}
