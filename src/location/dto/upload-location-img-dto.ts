import { ApiProperty } from "@nestjs/swagger";

export class UploadLocationImgDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ type: String, format: "binary"})
    img: any
} 