import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './diary/diary.module';
import { TodosModule } from './todo/todo.module';
import { TodolistModule } from './todolist/todolist.module';

@Module({
  imports: [DiaryModule, TodosModule, TodolistModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
