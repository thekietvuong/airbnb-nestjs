import { ApiProperty } from "@nestjs/swagger";

export class FilterUserDto {
    @ApiProperty({required: false})
    page: string;

    @ApiProperty({required: false})
    items_per_page: string;

    // @ApiProperty({required: false})
    // search: string;
}