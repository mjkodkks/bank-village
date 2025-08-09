export interface InterestResponse {
    saving_per_month: number; // 5% per year, divided by 12 months
    stock_per_month: number; // 8% per year, divided by 12 months
    loan_per_month: number; // 15% per year, divided by 12 months
    saving_per_year: number; // 5% per year
    stock_per_year: number; // 8% per year
    loan_per_year: number; // 15% per year
    saving_constant: string; // '5%'
    stock_constant: string; // '8%'
    loan_constant: string; // '15%'
}