import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772985577300 implements MigrationInterface {
    name = 'AutoMigration1772985577300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`explanation\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`explanation\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`explanation\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`explanation\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`content\` text NOT NULL`);
    }

}
