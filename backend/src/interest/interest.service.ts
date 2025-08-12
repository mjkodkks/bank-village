/*
https://docs.nestjs.com/providers#services
*/

import { PrismaService } from '@/prisma/prisma.service';
import {
  LOAN_INTEREST,
} from '@/utils/interest';
import { Injectable } from '@nestjs/common';
import { dayjs } from '@/utils/dayjs';

@Injectable()
export class InterestService {
  constructor(private prisma: PrismaService) {}
  async getCurrentInterest() {
    const now = dayjs.tz();
    const nowUtc = now.utc().toDate();

    const interestRate = await this.prisma.interestRate.findMany({
      where: {
        OR: [
          {
            effectiveTo: {
              gte: nowUtc,
            },
            effectiveFrom: {
              lte: nowUtc,
            },
          },
          {
            effectiveTo: null,
            effectiveFrom: {
              lte: nowUtc,
            },
          },
        ],
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
    console.log(interestRate);
    if (interestRate.length === 0) {
      return null;
    }
    // Assuming the first record is the most recent one
    const savingInterest = +interestRate.find(
      (rate) => rate.type === 'SAVING_INTEREST',
    ).rate;
    const stockInterest = +interestRate.find(
      (rate) => rate.type === 'STOCK_INTEREST',
    ).rate;
    
    const template = {
      saving_per_month: +savingInterest / 100 / 12, // divided by 12 months
      stock_per_month: +stockInterest / 100 / 12, // divided by 12 months
      loan_per_month: +LOAN_INTEREST / 100 / 12, // divided by 12 months
      saving_per_year: +savingInterest / 100, // per year
      stock_per_year: +stockInterest / 100, // per year
      loan_per_year: +LOAN_INTEREST / 100, // per year
      saving_constant: savingInterest,
      stock_constant: stockInterest,
      loan_constant: LOAN_INTEREST,
    };
    return template;
  }
}
