import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarColumnForUserTable1703132279832 implements MigrationInterface {
    name = 'AddAvatarColumnForUserTable1703132279832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
