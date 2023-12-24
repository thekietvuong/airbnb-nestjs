import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatRoomDto } from './dto/create-room-dto';
import { FilterRoomDto } from './dto/filter-room-dto';
import { UpdateRoomDto } from './dto/update-room-dto';
import { UploadRoomImgDto } from './dto/upload-room-img-dto';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

@ApiBearerAuth()
@ApiTags('Room')
@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
        private jwtService: JwtService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll(): Promise<Room[]> {
        return this.roomService.getAll();
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Req() req: any, @Body() creatRoomDto: CreatRoomDto) {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }
        const token = authorizationHeader.split(' ')[1];

        try {
            const userData = await this.jwtService.verifyAsync(token);
            // console.log(userData)
            // createCommentDto.user_id = userData.id;
            if (req.fileValidationError) {
                throw new BadRequestException(req.fileValidationError);
            }
            return this.roomService.create(creatRoomDto);
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    @UseGuards(AuthGuard)
    @Get('get-room-by-location/:locationCode')
    getByLocation(@Param('locationCode') location_code: number): Promise<Room[]> {
        return this.roomService.getByLocation(Number(location_code));
    }

    @UseGuards(AuthGuard)
    @Get('pagination')
    findAll(@Query() query: FilterRoomDto): Promise<any> {
        return this.roomService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<Room> {
        return this.roomService.getUserById(Number(id));
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Param('id') id: string, @Req() req: any, @Body() updateRoomDto: UpdateRoomDto) {
        return this.roomService.update(Number(id), req.user_data, updateRoomDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        return this.roomService.delete(Number(id), req.user_data);
    }

    @UseGuards(AuthGuard)
    @ApiConsumes("multipart/form-data")
    // @ApiBody({
    //     type: UploadRoomImgDto
    // })
    @Post('upload-room-img')
    // @UseInterceptors(FileInterceptor('img'))
    // uploadFile(@Body() uploadRoomImgDto: UploadRoomImgDto, @UploadedFile() file: Express.Multer.File): void {
    //     console.log(uploadRoomImgDto, file)
    // }
    @UseInterceptors(FileInterceptor('img', {
        storage: storageConfig('roomImg'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname)
            const allowedExtArr = ['.jpg', '.png', '.jpeg']
            if (!allowedExtArr.includes(ext)) { 
                req.fileValidationError = `Wrong extension type. Accepted file extensions are: ${allowedExtArr.toString()}`
                cb(null, false);
            } else {
                const fileSize = parseInt(req.headers[`content-length`]);
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5MB';
                    cb(null, false);
                } else {
                    cb(null, true);
                }
            }
        }
    }))
    updateRoomImg(@Req() req: any, @Body() uploadRoomImgDto: UploadRoomImgDto, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (!file) {
            throw new BadRequestException('File is required')
        }
        this.roomService.updateRoomImg(uploadRoomImgDto.id, req.user_data, file.destination + '/' + file.filename)
    }
}
