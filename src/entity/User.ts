import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts!: Post[];
}
