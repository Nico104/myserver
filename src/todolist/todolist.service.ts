import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TodolistService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.todoList.findMany({
      include: { todos: true },
    });
  }

  getOne(id: string) {
    return this.prisma.todoList.findUnique({
      where: { id },
      include: { todos: true },
    });
  }

  create(data: any) {
    return this.prisma.todoList.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.todoList.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.todoList.delete({ where: { id } });
  }
}
