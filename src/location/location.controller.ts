import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateLocationDto } from './dto/create-location-dto';
import { FilterLocationDto } from './dto/filter-location.dto';
import { UpdateLocationDto } from './dto/update-location-dto';
import { UploadLocationImgDto } from './dto/upload-location-img-dto';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';

@ApiBearerAuth()
@ApiTags('Location')
@Controller('location')
export class LocationController {
    constructor(
        private locationService: LocationService,
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getAll(): Promise<Location[]> {
        return this.locationService.getAll();
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async create(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.create(createLocationDto);
    }

    @UseGuards(AuthGuard)
    @Get('pagination')
    findAll(@Query() query:FilterLocationDto):Promise<any> {
        return this.locationService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getLocationById(@Param('id') id: number): Promise<Location[]> {
        return this.locationService.getLocationById(Number(id));
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Put(':id')
    update(@Param('id') id: string, @Req() req, @Body() updateLocationDto: UpdateLocationDto) {
        return this.locationService.update(Number(id), req.user_data, updateLocationDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        return this.locationService.delete(Number(id), req.user_data);
    }

    @UseGuards(AuthGuard)
    @ApiConsumes("multipart/form-data")
    @Post('upload-location-img')
    @UseInterceptors(FileInterceptor('img', {
        storage: storageConfig('locationImg'),
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
    updateLocationImg(@Req() req: any, @Body() uploadLocationImgDto: UploadLocationImgDto, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }
        if (!file) {
            throw new BadRequestException('File is required')
        }
        this.locationService.updateLocationImg(uploadLocationImgDto.id, req.user_data, file.destination + '/' + file.filename)
    }
}
