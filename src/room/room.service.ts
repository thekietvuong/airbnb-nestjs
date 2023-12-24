import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/location/entities/location.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreatRoomDto } from './dto/create-room-dto';
import { FilterRoomDto } from './dto/filter-room-dto';
import { UpdateRoomDto } from './dto/update-room-dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room) private roomRepository: Repository<Room>,
        @InjectRepository(Location) private locationRepository: Repository<Location>,
    ) { }

    async create(creatRoomDto: CreatRoomDto): Promise<any> {
        const location_code = creatRoomDto.location_code;
        // Kiểm tra location_code có tồn tại hay không
        const location = await this.locationRepository.find({
            where: {
                id: location_code
            },
        });
        if (location.length == 0) {
            throw new NotFoundException('This location does not exist');
        }
        return await this.roomRepository.save(creatRoomDto);
    }

    async getAll(): Promise<Room[]> {
        return await this.roomRepository.find()
    }

    async getByLocation(location_code: number): Promise<Room[]> {
        // Kiểm tra location_code có tồn tại hay không
        const location = await this.locationRepository.find({
            where: {
                id: location_code
            },
        });
        const rooms = await this.roomRepository.find({
            where: {
                location_code
            },
            relations: {
                location: true,
            },
            select: {
                location: {
                    id: true,
                    location_name: true,
                    img: true
                }
            }
        });
        if (rooms.length == 0 || location.length == 0) {
            throw new NotFoundException('There is no room at this location');
        }
        return rooms;
    }

    async findAll(query: FilterRoomDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        // const category = Number(query.category) || null;

        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.roomRepository.findAndCount({
            take: items_per_page,
            skip: skip,
        })
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        }
    }

    async getUserById(id: number): Promise<Room> {
        const room = await this.roomRepository.findOne({
            where: {
                id
            },
        });
        if (!room) {
            throw new NotFoundException('this room does not exist');
        }
        return room
    }

    async update(id: number, user_data: any, updateRoomDto: UpdateRoomDto): Promise<UpdateResult> {
        const room = await this.roomRepository.findOne({
            where: {
                id
            },
        });
        if (!room) {
            throw new NotFoundException('this room does not exist');
        }
        if (user_data.role != "ADMIN") {
            throw new ForbiddenException('Only admin can update this room infomation.');
        }
        return await this.roomRepository.update(id, updateRoomDto)
    }

    async delete(id: number, user_data: any): Promise<DeleteResult> {
        const room = await this.roomRepository.findOne({
            where: {
                id
            },
        });
        if (!room) {
            throw new NotFoundException('this room does not exist');
        }
        if (user_data.role != "ADMIN") {
            throw new ForbiddenException('Only admin can delete this room infomation.');
        }
        return await this.roomRepository.delete(id);
    }

    async updateRoomImg(id: number, user_data: any, img: string):Promise<UpdateResult>{
        return await this.roomRepository.update(id, {img})
    }
}
