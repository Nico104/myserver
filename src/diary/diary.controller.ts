import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  getAll(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('day') day?: string,
  ) {
    if (year && month && day) {
      return this.diaryService.getByDate(+year, +month, +day);
    }
    if (year && month) {
      return this.diaryService.getByMonth(+year, +month);
    }
    if (year) {
      return this.diaryService.getByYear(+year);
    }
    return this.diaryService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.diaryService.getOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.diaryService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.diaryService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.diaryService.delete(id);
  }
}
