import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    room_code: number;

    user_id: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    star_rating: number;
}