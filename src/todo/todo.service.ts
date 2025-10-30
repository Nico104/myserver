import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.todo.findMany({
      where: { deletedAt: null },
      orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  getAllByList(listId: string) {
    return this.prisma.todo.findMany({
      where: { listId, deletedAt: null },
      orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async getOne(id: string) {
    // Return even if soft-deleted? Keep it simple: only active
    return this.prisma.todo.findFirst({
      where: { id, deletedAt: null },
    });
  }

  create(data: any) {
    return this.prisma.todo.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, hard = false) {
    if (hard) {
      return this.prisma.todo.delete({ where: { id } });
    }
    return this.prisma.todo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
