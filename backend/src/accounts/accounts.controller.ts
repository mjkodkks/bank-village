import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  CreateAccountDto,
  CreateDepositTransactionDto,
  CreateWithdrawTransactionDto,
} from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create Account (เปิดบัญชี)' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @ApiOperation({ summary: 'Deposit (ฝากเงินเข้าบัญชี)' })
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  deposit(@Body() createDepositTransactionDto: CreateDepositTransactionDto) {
    const result = this.accountsService.deposit(createDepositTransactionDto);
    if (result === null) {
      throw new HttpException('Not Found Account!', HttpStatus.NOT_FOUND);
    }
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @ApiOperation({ summary: 'Withdraw (ถอนเงินออกจาบัญชี)' })
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(
    @Body() createWithdrawTransactionDto: CreateWithdrawTransactionDto,
  ) {
    const result = await this.accountsService.withdraw(
      createWithdrawTransactionDto,
    );
    if (result === null) {
      throw new HttpException('Not Found Account!', HttpStatus.NOT_FOUND);
    }
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Get('/types')
  @ApiOperation({ summary: 'List account type' })
  @UseGuards(JwtAuthGuard)
  findAccountTypeAll() {
    return this.accountsService.findAllAccountType();
  }

  @Get()
  @ApiOperation({ summary: 'List account' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get account by id' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Get('/transactions/:id')
  @ApiOperation({
    summary:
      'Get all transaction by account id (Transaction ทั้งหมดของ account จาก id)',
  })
  @UseGuards(JwtAuthGuard)
  findTransactions(@Param('id') id: string) {
    return this.accountsService.findTransactioonAll(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
