import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';

@Injectable()
export class ReportsService {
  async createStatement(option?: { isHTML?: boolean }) {
    const filePath = readFileSync(
      join(process.cwd(), '/views/statement/index.hbs'),
      'utf8',
    );

    const template = Handlebars.compile(filePath);
    const html = template({ name: 'Thanonphat Supho' });

    if (option && option.isHTML) {
      return html;
    }

    return await this.createPdfbyHtml(html);
  }
  async createRecipet() {
    const filePath = readFileSync(
      join(process.cwd(), '/views/statement/index.hbs'),
      'utf8',
    );

    const template = Handlebars.compile(filePath);
    const html = template({ name: 'Thanonphat Supho' });

    return html;
  }

  async createPdfbyHtml(html: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
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
    return await page.pdf({
      format: 'A4',
    });
  }
}
