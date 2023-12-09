import { MigrationInterface, QueryRunner } from "typeorm";

export class ControlSheetMigration1701965190661 implements MigrationInterface {
    name = 'ControlSheetMigration1701965190661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "tandem" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "tandem" TYPE smallint USING CASE WHEN "tandem" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "tandem" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "notlandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "notlandung" TYPE smallint USING CASE WHEN "notlandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "notlandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "startplatzwahl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "startplatzwahl" TYPE smallint USING CASE WHEN "startplatzwahl" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "startplatzwahl" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "aufziehen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "aufziehen" TYPE smallint USING CASE WHEN "aufziehen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "aufziehen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "kreise" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "kreise" TYPE smallint USING CASE WHEN "kreise" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "kreise" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "richtungswechsel" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "richtungswechsel" TYPE smallint USING CASE WHEN "richtungswechsel" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "richtungswechsel" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "acht" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "acht" TYPE smallint USING CASE WHEN "acht" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "acht" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "engekreise" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "engekreise" TYPE smallint USING CASE WHEN "engekreise" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "engekreise" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "sackflug" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "sackflug" TYPE smallint USING CASE WHEN "sackflug" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "sackflug" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "geschwBereich" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "geschwBereich" TYPE smallint USING CASE WHEN "geschwBereich" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "geschwBereich" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "beschlunigung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "beschlunigung" TYPE smallint USING CASE WHEN "beschlunigung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "beschlunigung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "negativsteuerung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "negativsteuerung" TYPE smallint USING CASE WHEN "negativsteuerung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "negativsteuerung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "gewichtsverlagerung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "gewichtsverlagerung" TYPE smallint USING CASE WHEN "gewichtsverlagerung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "gewichtsverlagerung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurten" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurten" TYPE smallint USING CASE WHEN "traggurten" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurten" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "pendeln" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "pendeln" TYPE smallint USING CASE WHEN "pendeln" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "pendeln" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rollen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rollen" TYPE smallint USING CASE WHEN "rollen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rollen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "klappen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "klappen" TYPE smallint USING CASE WHEN "klappen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "klappen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "ohren" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "ohren" TYPE smallint USING CASE WHEN "ohren" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "ohren" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "bStall" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "bStall" TYPE smallint USING CASE WHEN "bStall" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "bStall" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "spirale" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "spirale" TYPE smallint USING CASE WHEN "spirale" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "spirale" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "instrumente" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "instrumente" TYPE smallint USING CASE WHEN "instrumente" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "instrumente" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "soaring" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "soaring" TYPE smallint USING CASE WHEN "soaring" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "soaring" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "thermik" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "thermik" TYPE smallint USING CASE WHEN "thermik" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "thermik" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "landevolte" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "landevolte" TYPE smallint USING CASE WHEN "landevolte" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "landevolte" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "punktlandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "punktlandung" TYPE smallint USING CASE WHEN "punktlandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "punktlandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rueckenwindlandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rueckenwindlandung" TYPE smallint USING CASE WHEN "rueckenwindlandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "rueckenwindlandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurtenLandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurtenLandung" TYPE smallint USING CASE WHEN "traggurtenLandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "traggurtenLandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "hanglandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "hanglandung" TYPE smallint USING CASE WHEN "hanglandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "hanglandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "touchAndGo" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "touchAndGo" TYPE smallint USING CASE WHEN "touchAndGo" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "touchAndGo" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "examProgramme" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "examProgramme" TYPE smallint USING CASE WHEN "examProgramme" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "altitude_flight" ALTER COLUMN "examProgramme" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "fluglehre" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "fluglehre" TYPE smallint USING CASE WHEN "fluglehre" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "fluglehre" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "wetterkunde" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "wetterkunde" TYPE smallint USING CASE WHEN "wetterkunde" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "wetterkunde" SET DEFAULT 0`);
        
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "flugpraxis" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "flugpraxis" TYPE smallint USING CASE WHEN "flugpraxis" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "flugpraxis" SET DEFAULT 0`);
        
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "gesetzgebung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "gesetzgebung" TYPE smallint USING CASE WHEN "gesetzgebung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "gesetzgebung" SET DEFAULT 0`);
        
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "materialkunde" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "materialkunde" TYPE smallint USING CASE WHEN "materialkunde" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "theory" ALTER COLUMN "materialkunde" SET DEFAULT 0`);
        
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "auslegen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "auslegen" TYPE smallint USING CASE WHEN "auslegen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "auslegen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "aufziehen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "aufziehen" TYPE smallint USING CASE WHEN "aufziehen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "aufziehen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "slalom" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "slalom" TYPE smallint USING CASE WHEN "slalom" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "slalom" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "laufen_angebremst" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "laufen_angebremst" TYPE smallint USING CASE WHEN "laufen_angebremst" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "laufen_angebremst" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "vorbereitung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "vorbereitung" TYPE smallint USING CASE WHEN "vorbereitung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "vorbereitung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startphasen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startphasen" TYPE smallint USING CASE WHEN "startphasen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startphasen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "richtungsaenderungen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "richtungsaenderungen" TYPE smallint USING CASE WHEN "richtungsaenderungen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "richtungsaenderungen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startabbruch" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startabbruch" TYPE smallint USING CASE WHEN "startabbruch" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "startabbruch" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "seitenwindstart" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "seitenwindstart" TYPE smallint USING CASE WHEN "seitenwindstart" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "seitenwindstart" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "schlechtAusgelegt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "schlechtAusgelegt" TYPE smallint USING CASE WHEN "schlechtAusgelegt" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "schlechtAusgelegt" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "starts" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "starts" TYPE smallint USING CASE WHEN "starts" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "starts" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "landungen" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "landungen" TYPE smallint USING CASE WHEN "landungen" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "landungen" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notlandung" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notlandung" TYPE smallint USING CASE WHEN "notlandung" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notlandung" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notschirm" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notschirm" TYPE smallint USING CASE WHEN "notschirm" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "notschirm" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "kurven" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "kurven" TYPE smallint USING CASE WHEN "kurven" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "kurven" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "entwirren" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "entwirren" TYPE smallint USING CASE WHEN "entwirren" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "entwirren" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "faltmethoden" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "faltmethoden" TYPE smallint USING CASE WHEN "faltmethoden" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "faltmethoden" SET DEFAULT 0`);

        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "theorietest" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "theorietest" TYPE smallint USING CASE WHEN "theorietest" THEN 3 ELSE 0 END`);
        await queryRunner.query(`ALTER TABLE "training_hill" ALTER COLUMN "theorietest" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
