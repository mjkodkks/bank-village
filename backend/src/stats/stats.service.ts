import { AccountType, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const usersCount = await this.prisma.user.count();
    const accountsCount = await this.prisma.account.count();
    const transactionDeposit = await this.prisma.transaction.count({
      where: {
        action: 'DEPOSIT',
      },
    });
    const transactionWithdraw = await this.prisma.transaction.count({
      where: {
        action: 'WITHDRAWAL',
      },
    });

    const accountTypes = Object.values(AccountType);
    const sumBalance = {};
    for (const accType of accountTypes) {
      const template = await this.prisma.account.findMany({
        where: {
          type: accType,
        },
        select: {
          balance: true,
        },
      });
      const balances = template
        .map((m) => m.balance)
        .reduce((acc, cur) => {
          const sum = new Prisma.Decimal(acc);
          const current = new Prisma.Decimal(cur);
          return sum.add(current);
        }, new Prisma.Decimal(0));
      sumBalance[accType] = balances;
    }

    const sumSavingAndStock = new Prisma.Decimal(sumBalance['SAVING']).add(
      new Prisma.Decimal(sumBalance['STOCK']),
    );

    const template = {
      sumBalance,
      sumSavingAndStock,
      usersCount,
      accountsCount,
      transactionDeposit,
      transactionWithdraw,
    };
    return template;
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }
}
