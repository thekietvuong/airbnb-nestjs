import { Body, ForbiddenException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private commentRepository: Repository<Comment>,
        @InjectRepository(Room) private roomRepository: Repository<Room>,
    ) { }

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        const roomCode = createCommentDto.room_code;
        // Kiểm tra room_code có tồn tại hay không
        const room = await this.roomRepository.find({
            where: {
                id: roomCode
            },
        });

        if (room.length == 0) {
            throw new NotFoundException('room does not exist');
        }
        const comment_date = new Date();
        return await this.commentRepository.save({ ...createCommentDto, comment_date });
    }

    async getAll(): Promise<Comment[]> {
        return await this.commentRepository.find()
    }

    async update(id: number, user_id: number, updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
        const comment = await this.commentRepository.findOne({
            where: {
                id
            }
        })
        const comment_user_id = comment.user_id
        if (comment_user_id !== user_id) {
            throw new ForbiddenException('Only the comment owner can update this.');
        }
        return await this.commentRepository.update(id, updateCommentDto)
    }

    async delete(id: number, user_data: any): Promise<DeleteResult> {
        const comment = await this.commentRepository.findOne({
            where: {
                id
            }
        })
        const comment_user_id = comment.user_id
        if (comment_user_id !== user_data.id && user_data.role != "ADMIN") {
            throw new ForbiddenException('Only the comment owner or admin can delete this.');
        }
        return await this.commentRepository.delete(id);
    }

    async getAllByRoomCode(room_code: number): Promise<Comment[]> {
        const comments = await this.commentRepository.find({
            where: {
                room_code: room_code,
            },
            relations: {
                user: true,
                room: true,
            },
            select: {
                user: {
                    id: true,
                    name: true,
                    avatar: true
                },
                room: {
                    id: true,
                    room_name: true,
                    img: true
                }
            }
        });

        if (comments.length === 0) {
            throw new NotFoundException('No comments were found for this room code');
        }

        return comments;
    }
}
