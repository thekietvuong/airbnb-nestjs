import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBookRoomTable1702995304193 implements MigrationInterface {
    name = 'AddBookRoomTable1702995304193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`book_room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`room_code\` int NOT NULL, \`user_id\` int NOT NULL, \`check_in_date\` datetime NOT NULL, \`check_out_date\` datetime NOT NULL, \`num_guests\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`book_room\``);
    }

}
