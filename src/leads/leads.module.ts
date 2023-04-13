import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { MatchReason } from 'src/typeorm/entities/match-reason.entity';
import { Lead } from 'src/typeorm/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, MatchReason])],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
