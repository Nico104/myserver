import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StreakService } from './streak.service';

@Controller('streaks')
export class StreakController {
  constructor(private readonly streaks: StreakService) {}

  @Post()
  create(@Body() body: { name: string; description?: string | null; tz?: string; graceDays?: number }) {
    return this.streaks.create(body);
  }

  @Get()
  findAll() {
    return this.streaks.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.streaks.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string | null; tz?: string; graceDays?: number },
  ) {
    return this.streaks.update(id, body);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.streaks.softDelete(id);
  }

  @Post(':id/hits')
  addHit(@Param('id') id: string, @Body() body: { day?: string; source?: string | null; meta?: any }) {
    return this.streaks.addHit(id, body);
  }

  @Delete(':id/hits/:day')
  removeHit(@Param('id') id: string, @Param('day') day: string) {
    return this.streaks.removeHit(id, day);
  }
}
