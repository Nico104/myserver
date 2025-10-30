import { Module } from '@nestjs/common';
import { TodosController } from './todo.controller';
import { TodosService } from './todo.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TodosController],
  providers: [TodosService, PrismaService],
})
export class TodosModule {}
