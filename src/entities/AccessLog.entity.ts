import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UrlEntity } from './Url.entity';

@Entity('access_logs')
export class AccessLogEntity {
  @PrimaryGeneratedColumn()
  access_id: number;

  @Column()
  user_agent: string;

  @Column()
  ip_address: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UrlEntity, (url) => url.accessLogs, { onDelete: 'CASCADE' })
  url: UrlEntity;
}
