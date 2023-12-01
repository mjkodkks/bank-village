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
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  CreateAccountDto,
  CreateDepositTransactionDto,
  CreateInterestTransactionDto,
  CreateWithdrawTransactionDto,
  RollbackTransactionDto,
} from './dto/create-account.dto';
import { UpdateAccountDto, UpdateInterestDto } from './dto/update-account.dto';
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

  @ApiOperation({ summary: 'Interest (ฝากดอกเบี้ยเข้าบัญชี)' })
  @UseGuards(JwtAuthGuard)
  @Post('interest')
  async interest(
    @Body() createInterestTransactionDto: CreateInterestTransactionDto,
  ) {
    const result = await this.accountsService.interest(
      createInterestTransactionDto,
    );
    if (result === null) {
      throw new HttpException('Not Found Account!', HttpStatus.NOT_FOUND);
    }
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @ApiOperation({
    summary: 'Rollback transaction (ย้อนข้อมูลล่าสุดในบัญชีไป 1 ครั้ง)',
  })
  @UseGuards(JwtAuthGuard)
  @Post('rollback')
  async rollback(@Body() rollbackTransactionDto: RollbackTransactionDto) {
    const result = await this.accountsService.rollback(rollbackTransactionDto);
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

  @Get('/calculate-interest')
  @ApiOperation({ summary: 'calculate Interest' })
  calucateInterest(@Query() query: UpdateInterestDto) {
    return this.accountsService.calculateInterest(query);
  }

  @Get('/sum-interest')
  @ApiOperation({ summary: 'sum interest' })
  sumInterest(@Query() query: UpdateInterestDto) {
    console.log(query);
    return this.accountsService.sumInterest(query);
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

  @Get('/transactions/interest/:id')
  @ApiOperation({
    summary:
      'Get interest by account id (คำนวณ Interest ทั้งหมดของ account จาก id)',
  })
  @UseGuards(JwtAuthGuard)
  findInterestPerYear(@Param('id') id: string) {
    return this.accountsService.findInterestInYearFromAccountId(+id);
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
