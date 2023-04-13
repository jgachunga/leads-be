import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MatchReason } from './match-reason.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  leadUsername: string;

  @Column()
  email: string;

  @Column()
  leadUserTitle: string;

  @Column()
  suggestedResponse: string;

  @Column()
  reason: string;

  @Column()
  status: string;

  @Column()
  approved: string;

  @OneToMany(() => MatchReason, (matchReason) => matchReason.lead)
  @JoinColumn()
  matchReasons: MatchReason[];
}
