import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { BookRoomService } from './book-room.service';
import { CreateBookRoomDto } from './dto/create-bookroom-dto';
import { UpdateBookRoomDto } from './dto/update-bookroom-dto';
import { BookRoom } from './entities/book-room.entity';

@ApiBearerAuth()
@ApiTags('BookRoom')
@Controller('book-room')
export class BookRoomController {
    constructor(
        private bookRoomService: BookRoomService,
        private jwtService: JwtService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll(): Promise<BookRoom[]> {
        return this.bookRoomService.getAll();
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Req() req: any, @Body() createBookRoomDto: CreateBookRoomDto) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }
        const token = authorizationHeader.split(' ')[1];
        try {
            const userData = await this.jwtService.verifyAsync(token);
            createBookRoomDto.user_id = userData.id;
            if (req.fileValidationError) {
                throw new BadRequestException(req.fileValidationError);
            }
            return this.bookRoomService.create(createBookRoomDto);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookRoomService.findOne(+id);
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateBookRoomDto: UpdateBookRoomDto) {
        return this.bookRoomService.update(Number(id), req.user_data, updateBookRoomDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        return this.bookRoomService.delete(Number(id), req.user_data);
    }

    @UseGuards(AuthGuard)
    @Get('get-bookroom-by-userId/:userId')
    getByUserId(@Param('userId') userId: number): Promise<BookRoom[]> {
        return this.bookRoomService.getByUserId(Number(userId));
    }
}
