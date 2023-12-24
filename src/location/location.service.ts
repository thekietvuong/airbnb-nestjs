import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateLocationDto } from './dto/create-location-dto';
import { FilterLocationDto } from './dto/filter-location.dto';
import { UpdateLocationDto } from './dto/update-location-dto';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(Location) private locationRepository: Repository<Location>,
    ) { }

    async getAll(): Promise<Location[]> {
        return await this.locationRepository.find()
    }

    async create(createLocationDto: CreateLocationDto): Promise<Location> {
        return await this.locationRepository.save(createLocationDto);
    }

    async findAll(query: FilterLocationDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        // const category = Number(query.category) || null;

        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.locationRepository.findAndCount({
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

    async getLocationById(id: number): Promise<Location[]> {
        const location = await this.locationRepository.find({
            where: {
                id
            }
        });
        if (location.length === 0) {
            throw new NotFoundException('There is no information about this location');
        }
        return location;
    }

    async update(id: number, user_data: any, updateLocationDto: UpdateLocationDto): Promise<UpdateResult> {
        const location = await this.locationRepository.findOne({
            where: {
                id
            },
        });
        if (!location) {
            throw new NotFoundException('this location does not exist');
        }
        if (user_data.role != "ADMIN") {
            throw new ForbiddenException('Only admin can update this location.');
        }
        return await this.locationRepository.update(id, updateLocationDto)
    }

    async delete(id: number, user_data: any): Promise<DeleteResult> {
        const location = await this.locationRepository.findOne({
            where: {
                id
            },
        });
        if (!location) {
            throw new NotFoundException('this location does not exist');
        }
        if (user_data.role != "ADMIN") {
            throw new ForbiddenException('Only admin can delete this location.');
        }
        return await this.locationRepository.delete(id);
    }

    async updateLocationImg(id: number, user_data: any, img: string):Promise<UpdateResult>{
        return await this.locationRepository.update(id, {img})
    } 
} 
