import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

type Mode = 'DRY' | 'WET';

@Injectable()
export class BreathService {
  constructor(private prisma: PrismaService) {}

  // ---------- helpers ----------
  private dateOnly(isoYYYYMMDD: string): Date {
    // expects 'YYYY-MM-DD'
    return new Date(isoYYYYMMDD);
  }

  // ---------- BreathHoldAttempt ----------
  createHold(body: {
    day: string; // YYYY-MM-DD
    mode: Mode;
    durationSec: number;
    firstContractionSec?: number;
    contractions?: number;
    notes?: string;
  }) {
    return this.prisma.breathHoldAttempt.create({
      data: {
        day: this.dateOnly(body.day),
        mode: body.mode,
        durationSec: body.durationSec,
        firstContractionSec: body.firstContractionSec ?? null,
        contractions: body.contractions ?? null,
        notes: body.notes ?? null,
      },
    });
  }

  listHolds(q?: { from?: string; to?: string }) {
    const where: any = {};
    if (q?.from || q?.to) {
      where.day = {};
      if (q.from) where.day.gte = this.dateOnly(q.from);
      if (q.to) where.day.lte = this.dateOnly(q.to);
    }
    return this.prisma.breathHoldAttempt.findMany({
      where,
      orderBy: [{ day: 'desc' }, { createdAt: 'desc' }],
    });
  }

  getHold(id: string) {
    return this.prisma.breathHoldAttempt.findUnique({ where: { id } });
  }

  // ---------- BoxBreathingSet ----------
  createBox(body: {
    day: string; mode: Mode;
    inhaleSec: number; hold1Sec: number; exhaleSec: number; hold2Sec: number;
    cycles: number; completed?: number; notes?: string;
  }) {
    return this.prisma.boxBreathingSet.create({
      data: {
        day: this.dateOnly(body.day),
        mode: body.mode,
        inhaleSec: body.inhaleSec,
        hold1Sec: body.hold1Sec,
        exhaleSec: body.exhaleSec,
        hold2Sec: body.hold2Sec,
        cycles: body.cycles,
        completed: body.completed ?? null,
        notes: body.notes ?? null,
      },
    });
  }

  listBoxes(q?: { from?: string; to?: string }) {
    const where: any = {};
    if (q?.from || q?.to) {
      where.day = {};
      if (q.from) where.day.gte = this.dateOnly(q.from);
      if (q.to) where.day.lte = this.dateOnly(q.to);
    }
    return this.prisma.boxBreathingSet.findMany({
      where,
      orderBy: [{ day: 'desc' }, { createdAt: 'desc' }],
    });
  }

  getBox(id: string) {
    return this.prisma.boxBreathingSet.findUnique({ where: { id } });
  }

  // ---------- CO2 table ----------
  createCo2(body: {
    day: string; mode: Mode;
    holdSec: number; restStartSec: number; restStepSec: number; rounds: number;
    completed?: number; notes?: string;
  }) {
    return this.prisma.co2TableRun.create({
      data: {
        day: this.dateOnly(body.day),
        mode: body.mode,
        holdSec: body.holdSec,
        restStartSec: body.restStartSec,
        restStepSec: body.restStepSec,
        rounds: body.rounds,
        completed: body.completed ?? null,
        notes: body.notes ?? null,
      },
    });
  }

  listCo2(q?: { from?: string; to?: string }) {
    const where: any = {};
    if (q?.from || q?.to) {
      where.day = {};
      if (q.from) where.day.gte = this.dateOnly(q.from);
      if (q.to) where.day.lte = this.dateOnly(q.to);
    }
    return this.prisma.co2TableRun.findMany({
      where,
      orderBy: [{ day: 'desc' }, { createdAt: 'desc' }],
    });
  }

  getCo2(id: string) {
    return this.prisma.co2TableRun.findUnique({ where: { id } });
  }

  // ---------- O2 table ----------
  createO2(body: {
    day: string; mode: Mode;
    restSec: number; holdStartSec: number; holdStepSec: number; rounds: number;
    completed?: number; notes?: string;
  }) {
    return this.prisma.o2TableRun.create({
      data: {
        day: this.dateOnly(body.day),
        mode: body.mode,
        restSec: body.restSec,
        holdStartSec: body.holdStartSec,
        holdStepSec: body.holdStepSec,
        rounds: body.rounds,
        completed: body.completed ?? null,
        notes: body.notes ?? null,
      },
    });
  }

  listO2(q?: { from?: string; to?: string }) {
    const where: any = {};
    if (q?.from || q?.to) {
      where.day = {};
      if (q.from) where.day.gte = this.dateOnly(q.from);
      if (q.to) where.day.lte = this.dateOnly(q.to);
    }
    return this.prisma.o2TableRun.findMany({
      where,
      orderBy: [{ day: 'desc' }, { createdAt: 'desc' }],
    });
  }

  getO2(id: string) {
    return this.prisma.o2TableRun.findUnique({ where: { id } });
  }
}
