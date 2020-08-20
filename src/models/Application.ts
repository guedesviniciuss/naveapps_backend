import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import User from './User';

@Entity('applications')
class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  thumbnail: string;

  @Column()
  name: string;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column()
  link: string;

  @Column()
  likes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Application;
