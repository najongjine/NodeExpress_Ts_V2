import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { SubPost } from './SubPost';
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  title!: string;
  @Column()
  text!: string;
  @Column({ nullable: true })
  test!: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => SubPost, (subPost) => subPost.post, { nullable: true })
  subPosts!: SubPost[];
}
