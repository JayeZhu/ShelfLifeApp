import dayjs, { ManipulateType } from "dayjs";

const chineseToArabic: any = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

export const convertToNumber = (input: string | number) => {
  if (typeof input === 'string') {
    // 检查是否是汉字数字，如果是，则转换为阿拉伯数字
    const isChineseNumber = /[零一二三四五六七八九十百千万亿]/.test(input);
    if (isChineseNumber) {
      return input.split('').reduce((acc, curr) => acc * 10 + chineseToArabic[curr], 0);
    }
    // 检查是否是阿拉伯数字，如果是，则转换为数字
    const arabicNumber = parseInt(input);
    if (!isNaN(arabicNumber)) {
      return arabicNumber;
    }
  }
  // 如果无法转换，则返回 NaN
  return NaN;
};

export const getShelfDaysByResult = (res: any) => {
  const result = res?.data?.words_result as any[];
  const textArr = result?.map(i => i?.words);
  const shelfText = textArr?.find(i => i?.includes('保质')) || ''
  const [pre, suf] = shelfText?.includes('保质期') ? shelfText?.split('保质期') : shelfText?.split('保质');
  let [numStr, unit]: [string, ManipulateType] = ['', 'days'];
  if (suf) {
    if (suf?.includes('年')) {
      [numStr] = suf?.split('年');
      unit = 'year';
    } else if (suf?.includes('月')) {
      [numStr] = suf?.includes('个月') ? suf?.split('个月') : suf?.split('月');
      unit = 'month';
    } else if (suf?.includes('天')) {
      [numStr] = suf?.includes('天');
      unit = 'day';
    }
  }
  const num = convertToNumber(numStr);
  return { num, unit };
}

export const getProductionDayByResult = (res: any) => {
  const result = res?.data?.words_result as any[];
  console.log('result', result);
  const textArr = result?.map(i => i?.words);
  console.log('textArr', textArr);
  const dayStr = textArr?.find(i => i?.startsWith('20'));
  // const dayStr = textArr?.find(i => i?.startsWith('20') && dayjs.isDayjs(i));
  console.log('dayStr', dayStr);
  return dayStr ? dayjs(dayStr).format('YYYY-MM-DD') : '';
}