import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { BreathService } from './breath.service';

// controller accepts simple bodies (no DTOs)

@Controller('breath')
export class BreathController {
  constructor(private readonly service: BreathService) {}

  // ---- Breath hold ----
  @Post('holds')
  createHold(@Body() body: {
    day: string;              // "YYYY-MM-DD"
    mode: 'DRY' | 'WET';
    durationSec: number;
    firstContractionSec?: number;
    contractions?: number;
    notes?: string;
  }) {
    return this.service.createHold(body);
  }

  @Get('holds')
  listHolds(@Query() q: { from?: string; to?: string }) {
    return this.service.listHolds(q);
  }

  @Get('holds/:id')
  getHold(@Param('id') id: string) {
    return this.service.getHold(id);
  }

  // ---- Box breathing ----
  @Post('boxes')
  createBox(@Body() body: {
    day: string; mode: 'DRY' | 'WET';
    inhaleSec: number; hold1Sec: number; exhaleSec: number; hold2Sec: number;
    cycles: number; completed?: number; notes?: string;
  }) {
    return this.service.createBox(body);
  }

  @Get('boxes')
  listBoxes(@Query() q: { from?: string; to?: string }) {
    return this.service.listBoxes(q);
  }

  @Get('boxes/:id')
  getBox(@Param('id') id: string) {
    return this.service.getBox(id);
  }

  // ---- CO2 table ----
  @Post('co2')
  createCo2(@Body() body: {
    day: string; mode: 'DRY' | 'WET';
    holdSec: number; restStartSec: number; restStepSec: number; rounds: number;
    completed?: number; notes?: string;
  }) {
    return this.service.createCo2(body);
  }

  @Get('co2')
  listCo2(@Query() q: { from?: string; to?: string }) {
    return this.service.listCo2(q);
  }

  @Get('co2/:id')
  getCo2(@Param('id') id: string) {
    return this.service.getCo2(id);
  }

  // ---- O2 table ----
  @Post('o2')
  createO2(@Body() body: {
    day: string; mode: 'DRY' | 'WET';
    restSec: number; holdStartSec: number; holdStepSec: number; rounds: number;
    completed?: number; notes?: string;
  }) {
    return this.service.createO2(body);
  }

  @Get('o2')
  listO2(@Query() q: { from?: string; to?: string }) {
    return this.service.listO2(q);
  }

  @Get('o2/:id')
  getO2(@Param('id') id: string) {
    return this.service.getO2(id);
  }
}
