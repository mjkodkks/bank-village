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
  UpdateInterestHisotryDto,
} from './dto/create-account.dto';
import { UpdateAccountDto, UpdateInterestDto } from './dto/update-account.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { QueryIntersetDto } from './dto/query-account.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Account (เปิดบัญชี)' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @ApiBearerAuth()
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
    console.log('deposit: ' + result);
    return result;
  }

  @ApiBearerAuth()
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
    console.log('withdraw: ' + result);
    return result;
  }

  @ApiBearerAuth()
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
    console.log('interest: ' + result);
    return result;
  }

  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List account type' })
  @UseGuards(JwtAuthGuard)
  findAccountTypeAll() {
    return this.accountsService.findAllAccountType();
  }

  @Get('/calculate-interest')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'calculate Interest' })
  calucateInterest(@Query() query: UpdateInterestDto) {
    return this.accountsService.calculateInterest(query);
  }

  @Get('/sum-interest')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'sum interest' })
  sumInterest(@Query() query: UpdateInterestDto) {
    console.log(query);
    return this.accountsService.sumInterest(query);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List account' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get account by id' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(+id);
  }

  @Get('/transactions/interest/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get interest by account id (คำนวณ Interest ทั้งหมดของ account จาก id)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
  })
  @UseGuards(JwtAuthGuard)
  findInterestPerYear(@Param('id') id: string, @Query() query: QueryIntersetDto) {
    return this.accountsService.findInterestInYearFromAccountId(+id, query?.year);
  }

  @Get('/transactions/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all transaction by account id (Transaction ทั้งหมดของ account จาก id)',
  })
  @UseGuards(JwtAuthGuard)
  findTransactions(@Param('id') id: string) {
    return this.accountsService.findTransactionAll(+id);
  }

  @Post('/interest/history')
  @ApiOperation({
    summary:
      'Save interest from sum interest per year',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async saveInterestHistory(@Body() updateInterestHisotryDto: UpdateInterestHisotryDto) {
    const { account_id, year } = updateInterestHisotryDto
    const { sumOfInterest } = await this.accountsService.findInterestInYearFromAccountId(account_id, year)
    const result = this.accountsService.saveInterest(account_id, sumOfInterest, year)
    if (typeof result === 'string') {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    return result;
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
