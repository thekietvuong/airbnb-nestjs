import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
    @ApiProperty()
    content: string;

    @ApiProperty()
    star_rating: number;
}