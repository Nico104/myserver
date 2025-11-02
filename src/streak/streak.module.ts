import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
// Adjust this import to your project (e.g. '@/prisma/prisma.service')
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [StreakController],
  providers: [StreakService, PrismaService],
})
export class StreakModule {}
