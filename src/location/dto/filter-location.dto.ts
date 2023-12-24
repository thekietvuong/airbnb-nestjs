import { ApiProperty } from "@nestjs/swagger";

export class FilterLocationDto {
    @ApiProperty({required: false})
    page: string;

    @ApiProperty({required: false})
    items_per_page: string;

    @ApiProperty({required: false})
    search: string;
}