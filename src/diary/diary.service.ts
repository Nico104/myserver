import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DiaryService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.diaryEntry.findMany({
      orderBy: { entryDate: 'desc' },
    });
  }

  getOne(id: string) {
    return this.prisma.diaryEntry.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.prisma.diaryEntry.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.diaryEntry.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.diaryEntry.delete({ where: { id } });
  }

  async getByDate(year: number, month: number, day: number) {
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));
    const items = await this.prisma.diaryEntry.findMany({
      where: { entryDate: { gte: start, lt: end } },
      orderBy: { entryDate: 'asc' },
    });
    return items;
  }

  async getByMonth(year: number, month: number) {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));
    const items = await this.prisma.diaryEntry.findMany({
      where: { entryDate: { gte: start, lt: end } },
      orderBy: { entryDate: 'asc' },
    });
    return items;
  }

  async getByYear(year: number) {
    const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0));
    const items = await this.prisma.diaryEntry.findMany({
      where: { entryDate: { gte: start, lt: end } },
      orderBy: { entryDate: 'asc' },
    });
    return items;
  }
}
