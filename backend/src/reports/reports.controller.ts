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
import { ApiOperation, ApiQuery, ApiTags, PickType } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { json2csv } from 'json-2-csv';
import { AccountType } from '@prisma/client';
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @ApiOperation({
    summary:
      'list user receive interest CSV (ลิสต์ข้อมูลผู้ใช้ที่จะได้รับปันผลปีนี้ CSV),)',
  })
  @ApiQuery({
    name: 'accountType',
    enum: AccountType,
    required: false,
  })
  @Get('/list-user-receive-interest')
  async getReceiveInterestAnnuallyReport(
    @Res({ passthrough: true }) res: Response,
    @Query('accountType') accountType: AccountType,
  ) {
    const { userAndTransaction } =
      await this.reportsService.createUserListInterest({ accountType });

    const timestamp = Date.now();
    const csvString = json2csv(userAndTransaction, {
      keys: [
        {
          field: 'runNo',
          title: 'ลําดับ',
        },
        {
          field: 'name',
          title: 'ชื่อ-นามสกุล',
        },
        {
          field: 'sumOfinterest',
          title: 'ปันผล (บาท)',
        },
      ],
    });
    const filename = `annual_interest_document_${timestamp}.csv`;

    // // // Set the response headers to download the statement as a PDF file.
    const setHeader = {
      'Content-Type': 'application/octet-stream',
    };
    setHeader['Content-Disposition'] = `attachment; filename="${filename}"`;
    res.set(setHeader);

    // csvString to Buffer
    const csvBype = Buffer.from(csvString, 'utf-8');

    return new StreamableFile(csvBype);
    // return resultList;
  }

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
