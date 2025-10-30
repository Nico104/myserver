import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { TodosService } from './todo.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAll(@Query('listId') listId?: string) {
    return listId
      ? this.todosService.getAllByList(listId)
      : this.todosService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.todosService.getOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.todosService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.todosService.update(id, data);
  }

  // Soft delete by default
  @Delete(':id')
  delete(@Param('id') id: string, @Query('hard') hard?: string) {
    return this.todosService.delete(id, hard === 'true');
  }
}
