import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';

@Entity('match_reasons')
export class MatchReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchReason: string;

  @ManyToOne(() => Lead, (lead) => lead.matchReasons)
  @JoinColumn()
  lead: Lead;
}
