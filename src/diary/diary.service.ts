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
}
