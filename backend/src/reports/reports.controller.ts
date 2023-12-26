import {
  Controller,
  Get,
  Query,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @ApiOperation({
    summary: 'Create STATEMENT (สร้างรายการเดินบัญชี),)',
  })
  @Get('/statement')
  async createStatement(
    @Res({ passthrough: true }) res: Response,
    @Query('isHTML') isHTML: boolean,
  ) {
    // Call the createStatement() method of the reports service.
    const statement = await this.reportsService.createStatement({ isHTML });

    const timestamp = Date.now();
    const filename = `statement_${timestamp}.pdf`;

    // Set the response headers to download the statement as a PDF file.
    const setHeader = {
      'Content-Type': isHTML ? 'text/html' : 'application/pdf',
    };

    res.set(setHeader);

    if (isHTML) {
      return statement;
    } else {
      setHeader['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    res.set(setHeader);

    return new StreamableFile(statement as Buffer);
  }

  @ApiOperation({
    summary: 'Create RECIPET (สร้างใบเสร็จ)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/recipet')
  async createRecipet(@Res({ passthrough: true }) res: Response) {
    // Call the createStatement() method of the reports service.
    const statement = await this.reportsService.createRecipet();

    const timestamp = Date.now();
    const filename = `recipet${timestamp}.pdf`;

    // Set the response headers to download the statement as a PDF file.
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return 'test recipet';
  }
}
