import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('diary')
export class DiaryController {
  @Post()
  async create(@Body() body: any) {
    const entry = await prisma.diaryEntry.create({
      data: {
        entryDate: new Date(body.entryDate),
        title: body.title ?? null,
        bodyMd: body.bodyMd,
        tags: body.tags ?? [],
        rating: body.rating ?? null,
      },
    });
    return entry;
  }

  @Get()
  async all() {
    return prisma.diaryEntry.findMany();
  }
}

