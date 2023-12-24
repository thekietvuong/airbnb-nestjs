import { Comment } from 'src/comment/entities/comment.entity';
import { Location } from 'src/location/entities/location.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_name: string;

    @Column()
    guest: number;//

    @Column()
    bedroom: number;

    @Column()
    bed: number;

    @Column()
    bathroom: number;

    @Column()
    desc: string;

    @Column()
    price: number;

    @Column()
    washing_machine: boolean;

    @Column()
    iron: boolean;

    @Column()
    television: boolean;

    @Column()
    air_conditioning: boolean;

    @Column()
    wifi: boolean;

    @Column()
    kitchen: boolean;

    @Column()
    parking: boolean;

    @Column()
    pool: boolean;

    @Column()
    location_code: number;

    @Column()
    img: string;

    @OneToMany(() => Comment, (comment) => comment.room)
    comments: Comment[];

    @ManyToOne(() => Location, (location) => location.rooms)
    @JoinColumn({ name: 'location_code' })
    location: Location
}