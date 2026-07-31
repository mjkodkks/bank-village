import { dayjs } from '@/utils/dayjs';
import { dateFrom1AugAgoTo31Jul } from './useDate';

describe('dateFrom1AugAgoTo31Jul', () => {
  it('returns the fiscal year range for a supplied year', () => {
    let result = dateFrom1AugAgoTo31Jul(2025);
    console.log(result);

    result = dateFrom1AugAgoTo31Jul(2026);
    console.log(result);
  
    result = dateFrom1AugAgoTo31Jul();
    console.log(result);
  });
});
