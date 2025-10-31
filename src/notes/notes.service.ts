import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.note.findMany({
      where: { deletedAt: null },
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  getAllByPlan(planId: string) {
    return this.prisma.note.findMany({
      where: { planId, deletedAt: null },
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  getOne(id: string) {
    // return even if soft-deleted? keep parity with your Todos: only active
    return this.prisma.note.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: any) {
    return this.prisma.note.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.note.update({ where: { id }, data });
  }

  async delete(id: string, hard = false) {
    if (hard) return this.prisma.note.delete({ where: { id } });
    return this.prisma.note.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
