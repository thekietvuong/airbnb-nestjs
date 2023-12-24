import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';
import { Comment } from './entities/comment.entity';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth()
@ApiTags('Comment')
@Controller('comment')
export class CommentController {
    constructor(
        private commentService: CommentService,
        private jwtService: JwtService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll(): Promise<Comment[]> {
        return this.commentService.getAll();
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
        createCommentDto.user_id = req.user_data.id;
        return this.commentService.create(createCommentDto);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(Number(id), req.user_data.id, updateCommentDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        return this.commentService.delete(Number(id), req.user_data);
    }

    @UseGuards(AuthGuard)
    @Get('get-comments-by-roomCode/:roomCode')
    getAllByRoomCode(@Param('roomCode') room_code: number): Promise<Comment[]> {
        return this.commentService.getAllByRoomCode(Number(room_code));
    }
}
