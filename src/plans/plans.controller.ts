import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  // GET /plans
  @Get()
  getAll() {
    return this.plans.getAll();
  }

  // GET /plans/:id
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.plans.getOne(id);
  }

  // Nested: GET /plans/:id/notes
  @Get(':id/notes')
  getNotes(@Param('id') id: string) {
    return this.plans.getNotes(id);
  }

  // POST /plans
  @Post()
  create(@Body() data: any) {
    // expects { name, descriptionMd?, meta? }
    return this.plans.create(data);
  }

  // POST /plans/:id/notes  → convenience creator under a plan
  @Post(':id/notes')
  createNote(@Param('id') id: string, @Body() data: any) {
    // expects { title?, bodyMd, tags?, meta?, orderIdx? }
    return this.plans.createNote(id, data);
  }

  // PATCH /plans/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.plans.update(id, data);
  }

  // DELETE /plans/:id?hard=true
  @Delete(':id')
  delete(@Param('id') id: string, @Query('hard') hard?: string) {
    return this.plans.delete(id, hard === 'true');
  }
}
