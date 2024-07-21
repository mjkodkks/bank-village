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
import * as ExcelJS from 'exceljs';
import * as path from 'path';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  @ApiOperation({
    summary:
      'list user receive interest Excel (ลิสต์ข้อมูลผู้ใช้ที่จะได้รับปันผลปีนี้ Excel)',
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
    const { userAndTransaction, totalBalance, totalInterest } =
      await this.reportsService.createUserListInterest({ accountType });

    const timestamp = Date.now();

    const filePath = path.resolve(
      __dirname,
      '..',
      'assets',
      'templates',
      'template_bankvillage_interest.xlsx',
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(1); // Assuming you want to work with the first sheet

    // Add headers starting from A2
    // const headers = ['ลำดับ', 'ชื่อ-นามสกุล', 'รวมเงินหุ้น (บาท)', 'ยอดปันผล (บาท)', 'ลายมือผู้รับ', 'วัน/เดือน/ปี รับ'];
    const dataGrid = userAndTransaction.map((m) => {
      return [m.id, m.name, m.balance, m.sumOfinterest, '', ''];
    });
    const startRowIndex = 3;
    const totalRowNumber = 1
    const endRowIndex = startRowIndex + dataGrid.length + totalRowNumber;
    const endColNumberIndex = 6;
    const colIndex = 'A';

    worksheet.addTable({
      name: 'Table1',
      ref: colIndex + startRowIndex,
      headerRow: false,
      totalsRow: false,
      columns: [
        { name: 'id' },
        { name: 'name' },
        { name: 'balance' },
        { name: 'sumOfinterest' },
        { name: 'license' },
        { name: 'date' },
      ],
      rows: dataGrid,
    });

    worksheet.addRow(['', 'รวมทั้งหมด', totalBalance, totalInterest, '', '']);

    worksheet.eachRow(function (row, rowNumber) {
      row.eachCell(function (_cell, colNumber) {
        if (rowNumber >= 3 && rowNumber <= endRowIndex && colNumber <= endColNumberIndex) {
          row.height = 18;
          const cell = row.getCell(colNumber);
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          if (colNumber === 1) {
            cell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
            cell.numFmt = '#,##0.##';
          }
          if (colNumber === 3 || colNumber === 4) {
            cell.alignment = {
              horizontal: 'right',
              vertical: 'middle',
            };
            cell.numFmt = '#,##0.##';
          }
        }
      });
    });

    let accountName = '';
    if (accountType === 'SAVING') {
      accountName = 'ออมทรัพย์';
    } else if (accountType === 'STOCK') {
      accountName = 'หุ้น';
    }
    const filename = `ดอกเบี้ย${accountName}ธนาคารหมู่บ้าน_สาขากุดโดน_${timestamp}.xlsx`;

    // // // Set the response headers to download the statement as a PDF file.
    const setHeader = {
      'Content-Type': 'application/octet-stream',
    };
    setHeader['Content-Disposition'] =
      `attachment; filename="${encodeURI(filename)}"`;
    res.set(setHeader);

    const bufferWorkbook =
      (await workbook.xlsx.writeBuffer()) as unknown as Buffer;

    return new StreamableFile(bufferWorkbook);
    // return dataGrid;
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
