import dayjs from "dayjs";

export function dateFrom1AugAgoTo31Jul(year?: number) {
    const dateFromYear = year ? new Date(year, 6, 31) : new Date()
    const now = dayjs(dateFromYear);
    // calculate. start from year ago 1 August to 31 July of current year. 
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
    return {
        startDate,
        endDate
    }
}