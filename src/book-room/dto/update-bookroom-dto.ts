import { ApiProperty } from "@nestjs/swagger";

export class UpdateBookRoomDto {
    @ApiProperty()
    room_code: number;

    user_id: number;

    @ApiProperty({ default: () => new Date() })
    check_in_date: Date;

    @ApiProperty({ default: () => new Date() })
    check_out_date: Date;

    @ApiProperty()
    num_guests: number;
}