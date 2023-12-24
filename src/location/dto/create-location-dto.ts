import { ApiProperty } from "@nestjs/swagger";

export class CreateLocationDto {
    @ApiProperty()
    location_name: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    img: string;
}