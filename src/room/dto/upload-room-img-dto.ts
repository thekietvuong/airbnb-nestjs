import { ApiProperty } from "@nestjs/swagger";

export class UploadRoomImgDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ type: String, format: "binary"})
    img: any
}