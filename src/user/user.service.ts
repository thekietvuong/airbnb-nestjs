import { ConflictException, ForbiddenException, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { FilterUserDto } from './dto/filter-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find()
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const isUserExist = await this.userRepository.find({
            where: {
                email: createUserDto.email
            },
        });
        if (isUserExist.length > 0) {
            throw new ConflictException('This email already exists');
        }
        const hashPassword = await this.hashPassword(createUserDto.pass_word);
        return await this.userRepository.save({ ...createUserDto, pass_word: hashPassword });
    }

    async delete(id: number, user_data: any): Promise<DeleteResult> {
        const user = await this.userRepository.findOne({
            where: {
                id
            },
        });
        if (!user) {
            throw new NotFoundException('this user does not exist');
        }
        if (user.id !== id && user_data.role != "ADMIN") {
            throw new ForbiddenException('Only the owner or admin can delete this account.');
        }
        return await this.userRepository.delete(id);
    }

    async Pagination(query: FilterUserDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.userRepository.findAndCount({
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

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id
            },
        });
        if (!user) {
            throw new NotFoundException('this user does not exist');
        }
        return user
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        const user = await this.userRepository.findOne({
            where: {
                id
            },
        });
        return await this.userRepository.update(id, updateUserDto)
    }

    async searchName(name: string): Promise<User[]> {
        // Thực hiện tìm kiếm theo tên dựa trên query parameter
        return await this.userRepository.find({
            where: {
                name: Like(`%${name}%`), // Sử dụng Like để tìm kiếm tương đối
            },
        });
    }

    async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
        return await this.userRepository.update(id, { avatar })
    }

}
