import { Injectable } from '@nestjs/common';
import {
  CreateAccountDto,
  CreateDepositTransactionDto,
  CreateWithdrawTransactionDto,
} from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountType, Prisma } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto) {
    const { user_id, type } = createAccountDto;

    const [accountCreated] = await this.prisma.$transaction([
      this.prisma.user.update({
        data: {
          accountId: {
            create: {
              balance: 0,
              type,
            },
          },
        },
        where: {
          id: user_id,
        },
        select: {
          accountId: true,
        },
      }),
    ]);

    return accountCreated;
  }

  async deposit(createTransactionDto: CreateDepositTransactionDto) {
    const { account_id, amount, user_id, note } = createTransactionDto;
    const account = await this.prisma.account.findFirst({
      where: {
        id: account_id,
      },
    });

    if (!account) {
      return null;
    }

    const balanceInDecimal = new Prisma.Decimal(amount);

    const balanceTotal = account.balance.add(balanceInDecimal);

    const result = this.prisma.account.update({
      where: {
        id: account_id,
      },
      data: {
        balance: balanceTotal,
        transactions: {
          create: {
            previousBalance: account.balance,
            changeBalance: balanceTotal,
            amounts: balanceInDecimal,
            action: 'DEPOSIT',
            staffId: user_id,
            note,
          },
        },
      },
      select: {
        id: true,
        balance: true,
        createdAt: true,
        userId: true,
        type: true,
      },
    });

    return result;
  }

  async withdraw(createTransactionDto: CreateWithdrawTransactionDto) {
    const { account_id, amount, user_id, note } = createTransactionDto;
    const account = await this.prisma.account.findFirst({
      where: {
        id: account_id,
      },
    });

    const balanceInDecimal = new Prisma.Decimal(amount);

    if (!account) {
      return null;
    }

    if (account.balance.lessThan(balanceInDecimal)) {
      return 'Balance Not enough to withdraw';
    }

    const balanceTotal = account.balance.minus(balanceInDecimal);

    const result = this.prisma.account.update({
      where: {
        id: account_id,
      },
      data: {
        balance: balanceTotal,
        transactions: {
          create: {
            previousBalance: account.balance,
            changeBalance: balanceTotal,
            amounts: balanceInDecimal,
            action: 'WITHDRAWAL',
            staffId: user_id,
            note,
          },
        },
      },
    });

    return result;
  }

  async interest(createTransactionDto: CreateDepositTransactionDto) {
    const { account_id, amount, user_id, note } = createTransactionDto;
    const account = await this.prisma.account.findFirst({
      where: {
        id: account_id,
      },
    });

    if (!account) {
      return null;
    }

    const interestInDecimal = new Prisma.Decimal(amount);

    const result = this.prisma.account.update({
      where: {
        id: account_id,
      },
      data: {
        transactions: {
          create: {
            previousBalance: account.balance,
            action: 'INTEREST',
            interest: interestInDecimal,
            staffId: user_id,
            note,
          },
        },
      },
      select: {
        id: true,
        balance: true,
        interest: true,
        createdAt: true,
        userId: true,
        type: true,
      },
    });

    return result;
  }

  findAllAccountType() {
    const accounts = Object.keys(AccountType);
    return accounts;
  }

  findAll() {
    const account = this.prisma.account.findMany({
      select: {
        id: true,
        balance: true,
        interest: true,
        createdAt: true,
        userId: true,
        type: true,
        owner: {
          select: {
            username: true,
            role: true,
            firstname: true,
            surname: true,
          },
        },
      },
    });
    return account;
  }

  findOne(id: number) {
    const account = this.prisma.account.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        balance: true,
        createdAt: true,
        userId: true,
        type: true,
        owner: {
          select: {
            username: true,
            role: true,
            firstname: true,
            surname: true,
          },
        },
      },
    });
    return account;
  }

  findTransactioonAll(id: number) {
    const transactions = this.prisma.transaction.findMany({
      select: {
        id: true,
        action: true,
        previousBalance: true,
        changeBalance: true,
        amounts: true,
        interest: true,
        note: true,
        createdAt: true,
        staff: {
          select: {
            username: true,
            firstname: true,
            surname: true,
          },
        },
      },
      where: {
        accountId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return transactions;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
