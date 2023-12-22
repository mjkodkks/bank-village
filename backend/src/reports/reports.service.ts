import { Injectable } from '@nestjs/common';
import { CreateStatementDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import Handlebars from 'handlebars';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

@Injectable()
export class ReportsService {
  async createStatement() {
    const filePath = readFileSync(
      join(process.cwd(), '/views/statement/index.hbs'),
      'utf8',
    );

    const template = Handlebars.compile(filePath);
    const html = template({ name: 'Thanonphat Supho' });
    console.log(html);

    return await this.createPdfbyHtml(html);
  }
  async createRecipet() {
    const filePath = readFileSync(
      join(process.cwd(), '/views/statement/index.hbs'),
      'utf8',
    );

    const template = Handlebars.compile(filePath);
    const html = template({ name: 'Thanonphat Supho' });
    console.log(html);

    return await this.createPdfbyHtml(html);
  }

  async createPdfbyHtml(html: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // create a new page
    const page = await browser.newPage();

    // set your html as the pages content
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
    });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    // or a .pdf file
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
    await browser.close();

    return pdfBuffer;
  }
}
