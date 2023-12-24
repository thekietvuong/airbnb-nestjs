import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Repository, TypeORMError, UpdateResult } from 'typeorm';
import { CreateBookRoomDto } from './dto/create-bookroom-dto';
import { UpdateBookRoomDto } from './dto/update-bookroom-dto';
import { BookRoom } from './entities/book-room.entity';

@Injectable()
export class BookRoomService {
    constructor(
        @InjectRepository(BookRoom) private bookRoomRepository: Repository<BookRoom>,
        @InjectRepository(Room) private roomRepository: Repository<Room>,
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async create(createBookRoomDto: CreateBookRoomDto): Promise<BookRoom> {
        const roomCode = createBookRoomDto.room_code;
        // Kiểm tra room_code có tồn tại hay không
        const room = await this.roomRepository.find({
            where: {
                id: roomCode
            },
        });

        if (room.length == 0) {
            throw new NotFoundException('room does not exist');
        }
        return await this.bookRoomRepository.save(createBookRoomDto);
    }

    async getAll(): Promise<BookRoom[]> {
        return await this.bookRoomRepository.find()
    }

    async findOne(id: number) {
        const bookroom = await this.bookRoomRepository.findOne({
            where: { id }
        })
        if (!bookroom) {
            throw new NotFoundException('There are no book room with this id');
        }
        return bookroom
    }

    async update(id: number, user_data: any, updateBookRoomDto: UpdateBookRoomDto): Promise<UpdateResult> {
        
        const bookroom = await this.bookRoomRepository.findOne({ where: { id } })
        if (!bookroom) {
            throw new NotFoundException('There are no book room with this id');
        }

        
        const booker = bookroom.user_id
        if (booker !== user_data.id && user_data.role != "ADMIN") {
            throw new ForbiddenException('Only the booker or admin can edit it');
        }

        const room = await this.roomRepository.findOne({
            where: { id: updateBookRoomDto.room_code }
        })
        if (!room) {
            throw new NotFoundException('This roomcode does not exist. Please choose another roomcode');
        }

        return await this.bookRoomRepository.update(id, updateBookRoomDto)
    }

    async delete(id: number, user_data: any): Promise<DeleteResult> {
        const bookroom = await this.bookRoomRepository.findOne({ where: { id } })
        if (!bookroom) {
            throw new NotFoundException('There are no book room with this id');
        }

        const booker = bookroom.user_id
        if (booker !== user_data.id && user_data.role != "ADMIN") {
            throw new ForbiddenException('Only the booker or admin can delete it');
        }

        return await this.bookRoomRepository.delete(id);
    }

    async getByUserId(userId: number): Promise<BookRoom[]> {
        // Kiểm tra user có tồn tại hay không
        const user = await this.userRepository.find({
            where: {
                id: userId
            },
        });

        if (user.length == 0) {
            throw new NotFoundException('This user does not exist');
        }
        const bookRoom = await this.bookRoomRepository.find({
            where: {
                user_id: userId
            },
        });
        if (bookRoom.length == 0) {
            throw new NotFoundException('This user has not booked any rooms');
        }
        return bookRoom;
    }
}
