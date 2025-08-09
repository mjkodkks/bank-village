/*
https://docs.nestjs.com/providers#services
*/

import { LOAN_INTEREST, SAVING_INTEREST, STOCK_INTEREST } from '@/utils/interest';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InterestService {
    getCurrentInterest() {
        const template = {
            saving_per_month: +SAVING_INTEREST / 100 / 12, // 5% per year, divided by 12 months
            stock_per_month: +STOCK_INTEREST / 100 / 12, // 8% per year, divided by 12 months
            loan_per_month: +LOAN_INTEREST / 100 / 12, // 15% per year, divided by 12 months
            saving_per_year: +SAVING_INTEREST / 100, // 5% per year
            stock_per_year: +STOCK_INTEREST / 100, // 8% per year
            loan_per_year: +LOAN_INTEREST / 100, // 15% per year
            saving_constant: SAVING_INTEREST,
            stock_constant: STOCK_INTEREST,
            loan_constant: LOAN_INTEREST,
        };
        return template;
    }
}
