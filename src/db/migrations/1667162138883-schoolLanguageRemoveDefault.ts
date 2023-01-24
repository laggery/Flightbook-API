import {MigrationInterface, QueryRunner} from "typeorm";

export class schoolLanguageRemoveDefault1667162138883 implements MigrationInterface {
    name = 'schoolLanguageRemoveDefault1667162138883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ALTER "language" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "school" ALTER "language" SET DEFAULT 'de'`);
    }

}
