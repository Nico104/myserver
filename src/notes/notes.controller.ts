import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notes: NotesService) {}

  // GET /notes?planId=xxx  → if planId present, filter; else all active
  @Get()
  getAll(@Query('planId') planId?: string) {
    return planId ? this.notes.getAllByPlan(planId) : this.notes.getAll();
  }

  // GET /notes/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.notes.getOne(id);
  }

  // POST /notes
  @Post()
  create(@Body() data: any) {
    // expects { title?, bodyMd, tags?, meta?, planId? }
    return this.notes.create(data);
  }

  // PATCH /notes/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.notes.update(id, data);
  }

  // DELETE /notes/:id?hard=true
  @Delete(':id')
  delete(@Param('id') id: string, @Query('hard') hard?: string) {
    return this.notes.delete(id, hard === 'true');
  }
}
