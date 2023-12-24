import { Comment } from 'src/comment/entities/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    pass_word: string;

    @Column()
    phone: string;

    @Column()
    birth_day: string;

    @Column()
    gender: string;

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({ default: "USER" })
    role: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]
}