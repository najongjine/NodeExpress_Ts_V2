import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './Post';
@Entity()
export class SubPost {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  test!: string;

  @Column()
  postId!: number;

  @ManyToOne(() => Post, (post) => post.subPosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post!: Post;
}
