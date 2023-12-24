import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoomTable1703063923432 implements MigrationInterface {
    name = 'AddRoomTable1703063923432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`room_name\` varchar(255) NOT NULL, \`guest\` int NOT NULL, \`bedroom\` int NOT NULL, \`bed\` int NOT NULL, \`bathroom\` int NOT NULL, \`desc\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`washing_machine\` tinyint NOT NULL, \`iron\` tinyint NOT NULL, \`television\` tinyint NOT NULL, \`air_conditioning\` tinyint NOT NULL, \`wifi\` tinyint NOT NULL, \`kitchen\` tinyint NOT NULL, \`parking\` tinyint NOT NULL, \`pool\` tinyint NOT NULL, \`location_code\` int NOT NULL, \`img\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`room\``);
    }

}
