import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { BookRoomController } from './book-room.controller';
import { BookRoomService } from './book-room.service';
import { BookRoom } from './entities/book-room.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([BookRoom, Room, User]),
        ConfigModule
    ],
    controllers: [BookRoomController],
    providers: [BookRoomService]
})

export class BookRoomModule { }
