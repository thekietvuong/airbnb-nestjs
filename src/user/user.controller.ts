import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user-dto';
import { FilterUserDto } from './dto/filter-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UploadAvatarDto } from './dto/upload-avatar-dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll(): Promise<User[]> {
        return this.userService.getAll();
    }

    @Post()
    create(@Body() createUserDto:CreateUserDto):Promise<User> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        if(req.user_data.id != id && req.user_data.role != "ADMIN"){
            throw new ForbiddenException('Only the owner of this user or admin can delete this.');
        }
        return this.userService.delete(Number(id), req.user_data);
    }

    @UseGuards(AuthGuard)
    @Get('pagination')
    Pagination(@Query() query: FilterUserDto): Promise<any> {
        return this.userService.Pagination(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User> {
        return this.userService.getUserById(Number(id));
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        if(req.user_data.id != id && req.user_data.role != "ADMIN"){
            throw new ForbiddenException('Only the owner of this user or admin can update this.');
        }
        return this.userService.update(Number(id), updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('search/:userName')
    searchName(@Param('userName') name: string): Promise<any> {
        return this.userService.searchName(name);
    }

    @UseGuards(AuthGuard)
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: UploadAvatarDto
    })
    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
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
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (!file) {
            throw new BadRequestException('File is required')
        }
        this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename)
    }
}
