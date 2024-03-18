import { LOAN_INTEREST, STOCK_INTEREST } from './../utils/interest';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountDto,
  CreateDepositTransactionDto,
  CreateWithdrawTransactionDto,
  RollbackTransactionDto,
} from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AccountType, Prisma } from '@prisma/client';
import { dayjs } from '@/utils/dayjs';
import { SAVING_INTEREST } from '@/utils/interest';
import { Decimal } from '@prisma/client/runtime/library';

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
        createdAt: true,
        userId: true,
        type: true,
      },
    });

    return result;
  }

  async rollback(rollbackTransactionDto: RollbackTransactionDto) {
    const { account_id } = rollbackTransactionDto;
    const findLastTransaction = await this.prisma.account.findFirst({
      select: {
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      where: {
        id: account_id,
      },
    });

    // check if no any transaction in account
    if (
      findLastTransaction &&
      Array.isArray(findLastTransaction.transactions) &&
      findLastTransaction.transactions.length === 0
    ) {
      return 'No any transactions to rollback';
    }

    // check if not found acount and transaction
    const lastTransaction =
      findLastTransaction && findLastTransaction.transactions
        ? findLastTransaction.transactions[0]
        : null;

    if (!lastTransaction) {
      return 'not found account id';
    }

    const { action, previousBalance, id: id_last } = lastTransaction;

    let updateRecord;
    let deleteTransaction;
    const transactions = [];
    if (action === 'DEPOSIT' || action === 'WITHDRAWAL') {
      updateRecord = this.prisma.account.update({
        where: {
          id: account_id,
        },
        data: {
          balance: previousBalance,
        },
      });
      transactions.push(updateRecord);
    }

    // eslint-disable-next-line prefer-const
    deleteTransaction = this.prisma.transaction.delete({
      where: {
        id: id_last,
      },
    });

    transactions.push(deleteTransaction);

    const result = await this.prisma.$transaction(transactions);
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
        // interest: true,
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

  async findTransactionAll(id: number) {
    const transactions = await this.prisma.transaction.findMany({
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

  async findInterestInYearFromAccountId(id: number, year?: number) {
    const dateFromYear = year ? new Date(year, 6, 31) : new Date()
    const now = dayjs(dateFromYear);
    // calculate. start from previous year 1 August to 31 July of current year. 
    const startDate = now
      .utcOffset(0)
      .subtract(1, 'year')
      .startOf('year') 
      .add(7, 'months')
      .startOf('day')
      .toISOString();
    const endDate = now
      .utcOffset(0)
      .endOf('year')
      .subtract(5, 'months')
      .endOf('months')
      .toISOString();

    console.log(startDate, endDate);
    const transactions = await this.prisma.transaction.findMany({
      select: {
        id: true,
        interest: true,
        createdAt: true,
      },
      where: {
        accountId: id,
        action: 'INTEREST',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const initValue = new Prisma.Decimal(0);
    const sum = transactions
      .map((m) => m.interest)
      .reduce(
        (acc, current) => new Prisma.Decimal(acc).add(current),
        initValue,
      );
    const template = {
      sumOfInterest: sum,
      transactions,
    };
    return template;
  }

  async saveInterest(accountId: number,  amount: Decimal, year: number) {
    const isValidYear = (input) => {
      // Check if the input is a valid year using Day.js
      return dayjs(input, 'YYYY', true).isValid();
    }
    
    if (!isValidYear(year)) {
      return 'invalid year'
    }

    try {
      const interest = await this.prisma.interest.upsert({
        where: {
          year_accountId: {
            year,
            accountId,
          }
        },
        update: {
          amounts: amount,
        },
        create: {
          amounts: amount,
          year: year,
          accountId,
        },
      })
      console.log(`Upserted Interest: ${JSON.stringify(interest)}`);
      return interest
    } catch (error) {
      console.error('Error upserting Interest:', error);
      return "Error upserting Interest"
    }
  }

  async calculateInterest(option?: { isDry: boolean }) {
    // Get the start date of the current month
    // const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
    // Get the end date of the current month
    // const endDate = dayjs().endOf('month').format('YYYY-MM-DD');
    const isExited = (interest) => {
      return interest !== undefined && interest !== null;
    };

    if (
      !isExited(SAVING_INTEREST) ||
      !isExited(LOAN_INTEREST) ||
      !isExited(STOCK_INTEREST)
    ) {
      return null;
    }

    const savingInterestMultipy = new Prisma.Decimal(
      +SAVING_INTEREST / 100 / 12,
    );
    const stockInterestMultipy = new Prisma.Decimal(+STOCK_INTEREST / 100 / 12);

    const allAccounts = await this.prisma.account.findMany();
    console.log(allAccounts);
    const updateInterest = allAccounts.map((account) => {
      if (account.type === 'SAVING') {
        return {
          id: account.id,
          interest: account.balance.mul(savingInterestMultipy),
          type: account.type,
          beforeBalance: account.balance,
        };
      } else if (account.type === 'STOCK') {
        return {
          id: account.id,
          interest: account.balance.mul(stockInterestMultipy),
          type: account.type,
          beforeBalance: account.balance,
        };
      } else {
        return {
          id: account.id,
          interest: account.balance.mul(savingInterestMultipy),
          type: account.type,
          beforeBalance: account.balance,
        };
      }
    });
    console.log(updateInterest);
    if (option && option.isDry) {
      return updateInterest;
    }

    // update interest to account
    const transaction = await this.prisma.$transaction(
      updateInterest.map((acc) => {
        return this.prisma.account.update({
          where: {
            id: acc.id,
          },
          data: {
            transactions: {
              create: {
                previousBalance: acc.beforeBalance,
                action: 'INTEREST',
                interest: acc.interest,
                note: '*** ระบบคำนวณ ***',
              },
            },
          },
        });
      }),
    );

    return transaction;
  }

  async sumInterest(option?: { isDry: boolean }) {
    const allInterestTransaction = await this.prisma.transaction.findMany({
      where: {
        action: 'INTEREST',
      },
      select: {
        id: true,
        action: true,
        previousBalance: true,
        interest: true,
        createdAt: true,
        account: {
          select: {
            id: true,
            type: true,
            balance: true,
          },
        },
      },
    });
    // console.log(allInterestTransaction);
    const isSameYear = (date) => dayjs().isSame(date, 'year');
    const transactionInYear = allInterestTransaction.filter((f) =>
      isSameYear(f.createdAt),
    );
    // console.log(transactionInYear);
    const mapInterest = new Map<number, Prisma.Decimal>();
    for (const transaction of transactionInYear) {
      const key = transaction.account.id;
      const interestFromMap = mapInterest.get(key);
      if (interestFromMap) {
        mapInterest.set(key, interestFromMap.add(transaction.interest));
      } else {
        mapInterest.set(key, transaction.interest);
      }
    }
    // update interest to account
    // todo
    const tran = [];
    for (const [key, value] of mapInterest.entries()) {
      tran.push(null);
    }

    if (option && option.isDry) {
      console.log(mapInterest);
      return mapInterest;
    }
    // console.log(tran);
    const accountUpdated = await this.prisma.$transaction(tran);
    return accountUpdated;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
