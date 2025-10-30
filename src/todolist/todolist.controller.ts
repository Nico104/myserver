import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { TodolistService } from './todolist.service';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  getAll() {
    return this.todolistService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.todolistService.getOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.todolistService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.todolistService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todolistService.delete(id);
  }
}
