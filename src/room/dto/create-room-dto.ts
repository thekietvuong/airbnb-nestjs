import { ApiProperty } from "@nestjs/swagger";

export class CreatRoomDto {

    @ApiProperty()
    room_name: string;

    @ApiProperty()
    guest: number;//

    @ApiProperty()
    bedroom: number;

    @ApiProperty()
    bed: number;

    @ApiProperty()
    bathroom: number;

    @ApiProperty()
    desc: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    washing_machine: boolean;

    @ApiProperty()
    iron: boolean;

    @ApiProperty()
    television: boolean;

    @ApiProperty()
    air_conditioning: boolean;

    @ApiProperty()
    wifi: boolean;

    @ApiProperty()
    kitchen: boolean;

    @ApiProperty()
    parking: boolean;

    @ApiProperty()
    pool: boolean;
    
    @ApiProperty()
    location_code: number;

    @ApiProperty()
    img: string;
}