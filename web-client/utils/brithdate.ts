export const monthLists = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    th: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ]
  };

  export const mapMonthToNo = (month: string, lang: 'th' | 'en') => +monthLists[lang].indexOf(month) + 1
  export const mapNoToMonth = (no: number, lang: 'th' | 'en') => monthLists[lang][no - 1]

  export const getYear = (option?: { isBudda: boolean}) => {
      let currentYear = new Date().getFullYear();
      if (option && option.isBudda) {
          currentYear = currentYear + 543;
      }
      const yearsRange = 100;
      
      const yearList = [];
      for (let i = currentYear - yearsRange; i < currentYear; i++) {
        yearList.push(i + '');
      }
      return yearList.reverse();
  }

  export const getDay = () => Array.from({ length: 31 }, (_, index) => (index + 1) + '');

  