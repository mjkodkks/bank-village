export const monthLists = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    th: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ],
    enShort: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    thShort: [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ]
  };

  type LangMonth = 'en' | 'th' | 'enShort' | 'thShort'

  export const mapMonthToNo = (month: string, lang: LangMonth) => +monthLists[lang].indexOf(month) + 1
  export const mapNoToMonth = (no: number, lang: LangMonth) => monthLists[lang][no - 1]

/**
 * Gets the list of years in reverse order based on the current year and an optional option.
 *
 * @param {Object} [option] - An optional object that can contain the property `isBudda` which is a boolean indicating whether to adjust the current year based on the Buddhahood calendar.
 * @param {boolean} [option.isBudda] - A boolean indicating whether to adjust the current year based on the Buddhahood calendar.
 * @return {string[]} An array of strings representing the list of years in reverse order.
 */
  export const getYear = (option?: { isBudda?: boolean, limit?: number }) => {
      let currentYear = new Date().getFullYear();
      if (option && option.isBudda) {
          currentYear = currentYear + 543;
      }
      const yearsRange = option && option.limit ? option.limit : 100;
      
      const yearList = [];
      for (let i = currentYear - yearsRange; i <= currentYear; i++) {
        yearList.push(i + '');
      }
      return yearList.reverse();
  }

  export const getDay = () => Array.from({ length: 31 }, (_, index) => (index + 1) + '');

  