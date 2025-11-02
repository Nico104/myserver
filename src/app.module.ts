import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './diary/diary.module';
import { TodosModule } from './todo/todo.module';
import { TodolistModule } from './todolist/todolist.module';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { NotesModule } from './notes/notes.module';
import { PlansModule } from './plans/plans.module';
import { StreakModule } from './streak/streak.module';
import { BreathModule } from './breath/breath.module';

@Module({
  imports: [DiaryModule, TodosModule, TodolistModule, NotesModule, PlansModule, StreakModule, BreathModule],
  // controllers: [NotesController],
  // providers: [NotesService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
