import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationTable1703087835803 implements MigrationInterface {
    name = 'AddLocationTable1703087835803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`location_name\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`country\` varchar(255) NOT NULL, \`img\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`location\``);
    }

}
