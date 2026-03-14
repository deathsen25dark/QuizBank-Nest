import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772963760362 implements MigrationInterface {
    name = 'AutoMigration1772963760362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`explaination\` \`explanation\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` CHANGE \`explanation\` \`explaination\` text NOT NULL`);
    }

}
