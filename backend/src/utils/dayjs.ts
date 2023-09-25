import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/en';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export { dayjs };
