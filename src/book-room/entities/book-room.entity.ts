import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class BookRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_code: number;

    @Column()
    user_id: number;

    @Column({ type: Date })
    check_in_date: Date;

    @Column({ type: Date })
    check_out_date: Date;

    @Column()
    num_guests: number;
}