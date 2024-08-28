import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import puppeteer from 'puppeteer';
import { PrismaService } from '@/prisma/prisma.service';
import { dateFrom1AugAgoTo31Jul } from '@/utils/useDate';
import { AccountType, Prisma } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}
  async createUserListInterest(option: { accountType?: AccountType, year?: number } = { accountType: "SAVING", year: 2024 }) {
    const { startDate, endDate } = dateFrom1AugAgoTo31Jul(option.year);
    const result = await this.prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        surname: true,
        username: true,
        accountId: {
          select: {
            transactions: {
              select: {
                interest: true,
                // createdAt: true
              },
              where: {
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
                action: "INTEREST"
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            balance: true
          },
          where: {
            type: option.accountType,
          }
        }
      },
      orderBy: {
        id: 'asc',
      }
    });

    const initValue = new Prisma.Decimal(0);
    const excludeUser = ['super'];
    const filterUser = result.filter(f => !excludeUser.includes(f.username) && f.accountId.length > 0 && f.accountId[0].transactions.length > 0);
    const userAndTransaction = filterUser.map((m, i) => {
      return {
        id: m.id,
        runNo: i + 1,
        name: m.firstname + ' ' + m.surname,
        balance: +m.accountId.map((m) => m.balance).at(0),
        // transactions: m.accountId.map((m) => m.transactions)
        // .flat(),
        sumOfinterest: +m.accountId
          .map((m) => m.transactions)
          .flat()
          .map((m) => m.interest)
          .reduce((a, b) => a.add(b), initValue),
      };
    })
    const totalBalance = userAndTransaction.map(m => m.balance).reduce((a, b)=> a + b, 0)
    const totalInterest = userAndTransaction.map(m => m.sumOfinterest).reduce((a, b)=> a + b, 0)
    
    const template = {
      userAndTransaction,
      totalBalance,
      totalInterest
    };
    return template;
  }
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
      headless: true,
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
