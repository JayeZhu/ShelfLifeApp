const chineseToArabic = {
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

export const convertToNumber = (input) => {
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