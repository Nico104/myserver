import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';


type CreateStreakInput = {
  name: string;
  description?: string | null;
  tz?: string;
  graceDays?: number;
};

type UpdateStreakInput = Partial<CreateStreakInput>;

type AddHitInput = {
  day?: string;
  source?: string | null;
  meta?: Prisma.InputJsonValue;
};

@Injectable()
export class StreakService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStreakInput) {
    return this.prisma.streak.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        cadence: 'DAILY',
        tz: data.tz ?? 'Europe/Vienna',
        graceDays: data.graceDays ?? 1,
      },
    });
  }

  async findAll() {
    return this.prisma.streak.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { hits: { where: { deletedAt: null }, orderBy: { day: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const streak = await this.prisma.streak.findFirst({
      where: { id, deletedAt: null },
      include: { hits: { where: { deletedAt: null }, orderBy: { day: 'asc' } } },
    });
    if (!streak) throw new NotFoundException('Streak not found');
    return streak;
  }

  async update(id: string, data: UpdateStreakInput) {
    await this.ensureExists(id);
    const updated = await this.prisma.streak.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        tz: data.tz,
        graceDays: data.graceDays,
      },
    });
    if (data.tz !== undefined || data.graceDays !== undefined) {
      await this.recomputeDenorms(id);
    }
    return updated;
  }

  async softDelete(id: string) {
    await this.ensureExists(id);
    return this.prisma.streak.update({
      where: { id },
      data: { deletedAt: new Date(), endedOn: this.dateOnly(new Date()) },
    });
  }

  async addHit(streakId: string, input: AddHitInput) {
    const streak = await this.ensureExists(streakId);
    const dayDate = input.day
      ? this.parseYMDToUTCDate(input.day)
      : this.todayDateInTzAsUTC(streak.tz);

    try {
      await this.prisma.streakHit.create({
        data: {
          streakId,
          day: dayDate,
          source: input.source ?? 'manual',
          meta: input.meta ?? {},
        },
      });
    } catch (e) {
      if (this.isUniqueConstraintError(e)) {
        throw new BadRequestException('Hit for this day already exists.');
      }
      throw e;
    }

    await this.recomputeDenorms(streakId);
    return this.findOne(streakId);
  }

  async removeHit(streakId: string, day: string) {
    await this.ensureExists(streakId);
    const dayDate = this.parseYMDToUTCDate(day);

    const hit = await this.prisma.streakHit.findFirst({
      where: { streakId, day: dayDate, deletedAt: null },
    });
    if (!hit) throw new NotFoundException('Hit not found for given day');

    await this.prisma.streakHit.update({
      where: { id: hit.id },
      data: { deletedAt: new Date() },
    });

    await this.recomputeDenorms(streakId);
    return this.findOne(streakId);
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.streak.findFirst({ where: { id, deletedAt: null } });
    if (!exists) throw new NotFoundException('Streak not found');
    return exists;
  }

  private isUniqueConstraintError(e: unknown) {
    return typeof e === 'object' && e !== null && (e as any).code === 'P2002';
    }

  private todayDateInTzAsUTC(tz: string) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .formatToParts(new Date())
      .reduce<Record<string, string>>((acc, p) => {
        if (p.type !== 'literal') acc[p.type] = p.value;
        return acc;
      }, {});
    const y = Number(parts.year);
    const m = Number(parts.month);
    const d = Number(parts.day);
    return new Date(Date.UTC(y, m - 1, d));
  }

  private parseYMDToUTCDate(ymd: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) throw new BadRequestException('Invalid day format, expected YYYY-MM-DD');
    const [, y, mo, d] = m;
    return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  }

  private dateOnly(d: Date) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private async recomputeDenorms(streakId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { id: streakId } });
    if (!streak) return;

    const hits = await this.prisma.streakHit.findMany({
      where: { streakId, deletedAt: null },
      orderBy: { day: 'asc' },
      select: { day: true },
    });

    if (hits.length === 0) {
      await this.prisma.streak.update({
        where: { id: streakId },
        data: {
          lastHitOn: null,
          currentLen: 0,
          longestLen: 0,
          startedOn: null,
        },
      });
      return;
    }

    const allowGap = 1 + (streak.graceDays ?? 0);

    let longest = 1;
    let current = 1;

    for (let i = 1; i < hits.length; i++) {
      const prev = hits[i - 1].day;
      const cur = hits[i].day;
      const gap = Math.round((this.dateOnly(cur).getTime() - this.dateOnly(prev).getTime()) / 86_400_000);
      if (gap <= allowGap) current += 1;
      else {
        longest = Math.max(longest, current);
        current = 1;
      }
    }
    longest = Math.max(longest, current);

    await this.prisma.streak.update({
      where: { id: streakId },
      data: {
        lastHitOn: hits[hits.length - 1].day,
        currentLen: current,
        longestLen: longest,
        startedOn: hits[0].day,
      },
    });
  }
}
