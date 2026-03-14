import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772964017888 implements MigrationInterface {
    name = 'AutoMigration1772964017888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`answer_json\` \`answers_json\` json NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`answers_json\` \`answer_json\` json NOT NULL`);
    }

}
