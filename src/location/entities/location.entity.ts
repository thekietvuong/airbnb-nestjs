import { Room } from 'src/room/entities/room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    location_name: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    img: string;

    @OneToMany(() => Room, (room) => room.location)
    rooms: Room[]
}