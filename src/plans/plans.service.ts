import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.plan.findMany({
      where: { deletedAt: null },
      orderBy: [{ updatedAt: 'desc' }],
      select: {
        id: true, name: true, description: true, meta: true,
        createdAt: true, updatedAt: true, deletedAt: true,
      },
    });
  }

  getOne(id: string) {
    return this.prisma.plan.findFirst({
      where: { id, deletedAt: null },
      include: {
        notes: {
          where: { deletedAt: null },
          orderBy: [{ createdAt: 'asc' }],
        },
      },
    });
  }

  getNotes(id: string) {
    return this.prisma.note.findMany({
      where: { planId: id, deletedAt: null },
      orderBy: [{ updatedAt: 'desc' }],
    });
  }

  create(data: any) {
    return this.prisma.plan.create({ data });
  }

  createNote(planId: string, data: any) {
    // if you kept PlanNote model instead of unified Note, swap to prisma.planNote
    return this.prisma.note.create({ data: { ...data, planId } });
  }

  update(id: string, data: any) {
    return this.prisma.plan.update({ where: { id }, data });
  }

  async delete(id: string, hard = false) {
    if (hard) return this.prisma.plan.delete({ where: { id } });
    return this.prisma.plan.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
