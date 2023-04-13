import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './typeorm/entities/lead.entity';
import { MatchReason } from './typeorm/entities/match-reason.entity';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '178.62.47.80',
      port: 3306,
      username: 'gachunga',
      password: 'mypass',
      database: 'aristotle',
      entities: [Lead, MatchReason],
      synchronize: true,
    }),
    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
