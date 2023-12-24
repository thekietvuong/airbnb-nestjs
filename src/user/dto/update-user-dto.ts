import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty({required: false})
    name: string;

    @ApiProperty({required: false})
    email: string;

    @ApiProperty({required: false})
    phone: string;

    @ApiProperty({required: false})
    birth_day: string;

    @ApiProperty({required: false})
    gender: string;
    // category: string;
}