import { ApiProperty } from "@nestjs/swagger";

export class UpdateLocationDto {
    @ApiProperty()
    location_name: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    img: string;
}