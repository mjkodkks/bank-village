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

    const template = {
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
