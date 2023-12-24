import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultForUserRole1702952009505 implements MigrationInterface {
    name = 'AddDefaultForUserRole1702952009505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` varchar(255) NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
    }

}
