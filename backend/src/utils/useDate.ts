import dayjs from "dayjs";

export function dateFrom1AugAgoTo31Jul(year?: number) {
  let endYear = null
  if (year) {
    endYear =  dayjs(new Date(year, 6, 31));
  } else {
    console.log("check current Date: ", dayjs())
    console.log("check current Month: ", dayjs().month() + 1);
    const currentMonth = dayjs().month() + 1; // dayjs month is 0-indexed
    const isSameOrMore = currentMonth >= 8;
    if (isSameOrMore) {
      endYear = dayjs().add(1, 'year');
    } else {
      endYear = dayjs();
    }
  }
    // calculate. start from year ago 1 August to 31 July of current year. 
    const startDate = endYear
      .utcOffset(0)
      .subtract(1, 'year')
      .startOf('year') 
      .add(7, 'months')
      .startOf('day')
      .toISOString();
    const endDate = endYear
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