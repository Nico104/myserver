import { Module } from '@nestjs/common';
import { TodolistController } from './todolist.controller';
import { TodolistService } from './todolist.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TodolistController],
  providers: [TodolistService, PrismaService],
})
export class TodolistModule {}
