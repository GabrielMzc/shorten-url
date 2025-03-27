import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { AccessLogEntity } from './AccessLog.entity';

@Entity('urls')
export class UrlEntity {
  @PrimaryGeneratedColumn()
  url_id: number;

  @Column()
  original_url: string;

  @Column({ unique: true })
  short_url: string;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  deleted_at?: Date;

  @ManyToOne(() => UserEntity, (user) => user.urls, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  user?: UserEntity;

  @OneToMany(() => AccessLogEntity, (accessLog) => accessLog.url)
  accessLogs: AccessLogEntity[];
}
