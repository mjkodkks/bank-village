/*
https://docs.nestjs.com/controllers#controllers
*/

import { CreateDepositTransactionDto } from '@/accounts/dto/create-account.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InterestService } from './interest.service';

@ApiTags('interest')
@Controller('interest')
export class InterestController {
    constructor(
        private readonly interestService: InterestService
    ) {

    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'get current interest (ดึงอัตราดอกเบี้ยปัจจุบัน)' })
    @UseGuards(JwtAuthGuard)
    @Get('current-interest')
    currentInterest(){
        const interest = this.interestService.getCurrentInterest();
        if (interest === null) {
            throw new HttpException('Interest not found', HttpStatus.NOT_FOUND);
        }
        return interest;
    }
}
