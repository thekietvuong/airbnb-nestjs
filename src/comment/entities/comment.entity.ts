import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room_code: number;

    @Column()
    user_id: number;

    @Column({ type: Date })
    comment_date: Date;

    @Column()
    content: string;

    @Column()
    star_rating: number;

    @ManyToOne(() => Room, (room) => room.comments)
    @JoinColumn({ name: 'room_code' })
    room: Room;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;
}