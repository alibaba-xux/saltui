import {
  parseDate,
  addZero,
  isArray,
  numToDate,
  makeRange,
  isUndefined,
  getDaysByYear,
  getDaysByMonth,
  getMonthsByYear,
  getDateRangeArr,
  parseDisabledArr,
} from './base';
import locale from './locale';
import dateFormat from './dateFormat';
import Slot from '../../Slot';
import { shouldUpdate } from '../../Utils';

const { warn, error } = console;
const colFlags = ['Y', 'M', 'D', 'T', 'h', 'H', 'm', 's', 'YMD', 'YMDW'];

/**
 * 解析参数值
 * @param { object | string | date | string | number  } value
 * @example {value: 1545484545454} [2018,2,1] 1212154545454, ***
 * @returns array
 */
function parseValue(value) {
  const date = new Date(parseDate(value));
  let timeType;
  if (value && value.timeType) {
    timeType = ({ AM: 0, PM: 1 })[value.timeType || 'AM'];
  } else {
    timeType = date.getHours() >= 12 ? 1 : 0;
  }
  return [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    timeType,
    date.getHours() >= 13 ? date.getHours() - 12 : date.getHours(), // 12小时制
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    // 获取年月日组合，转换成number
    `${date.getFullYear()}${addZero(date.getMonth() + 1)}${addZero(date.getDate())}` - 0,
    `${date.getFullYear()}${addZero(date.getMonth() + 1)}${addZero(date.getDate())}` - 0,
  ];
}

/**
 * sure 可以控制是否添加周"几" 根据日期获取一周中的一天，默认是 true
 * @param {*} days
 * @param {*} props
 * @param {*} sure
 */

/* eslint-disable no-param-reassign */
function addDayOfWeek(days, props, sure = true) {
  if (isArray(days)) {
    days.forEach((day) => {
      const dayNew = day;
      const date = new Date(numToDate(day.value));
      if (sure) {
        dayNew.text = `${dateFormat(date, 'YYYY/MM/DD')} ${locale[props.locale].week[date.getDay()]}`;
      } else {
        dayNew.text = dateFormat(date, 'YYYY/MM/DD');
      }
    });
    return;
  }
  const date = new Date(numToDate(days.value));
  if (sure) {
    days.text = `${dateFormat(date, 'YYYY/MM/DD')} ${locale[props.locale].week[date.getDay()]}`;
  } else {
    days.text = dateFormat(date, 'YYYY/MM/DD');
  }
}
/* eslint-enable no-param-reassign */

/**
 * 根据 props columns 计算 slot list
 * @param {*} arr
 * @param {*} props
 */
function formatFromProps(arr, props) {
  const { columns } = props;
  const displayList = [];
  for (let i = 0; i < columns.length; i += 1) {
    if (colFlags.indexOf(columns[i]) !== -1) {
      displayList.push(arr[colFlags.indexOf(columns[i])]);
    }
    if (columns[i] === 'YMDW') {
      addDayOfWeek(displayList[i], props);
    }
    if (columns[i] === 'YMD') {
      addDayOfWeek(displayList[i], props, false);
    }
  }
  return displayList;
}

/**
 * 添加年月日等文本
 * @param { array } arr
 * @param {string } text
 * @param { object } props
 */

function formatText(arr, text, props) {
  const formatArray = [];
  const localeCode = props.locale;
  for (let i = 0; i < arr.length; i += 1) {
    const el = arr[i];
    formatArray.push(isArray(el) ?
      formatText(el, locale[localeCode].surfix[colFlags[i]], props) :
      {
        text: addZero(el.text) +
              (isUndefined(text) ? locale[localeCode].surfix[colFlags[i]] : text),
        value: el.value,
      });
  }
  return formatArray;
}

/**
 * 获取 options
 * @param {*} value
 * @param {*} props
 */
function getOptions(value, props) {
  let { minDate, maxDate } = props;
  const { disabledTime, disabledDate } = props;
  const { minuteStep } = props;
  minDate = parseDate(minDate);
  maxDate = parseDate(maxDate);
  if (maxDate <= minDate) {
    error(' Datetime： props maxDate must be greater than minDate ');
    return [];
  }
  minDate = new Date(minDate);
  maxDate = new Date(maxDate);
  const currentValue = new Date(parseDate(value));
  const dayYear = getDaysByYear({
    year: currentValue.getFullYear(), minDate, maxDate, disabledDate,
  });
  const disabled = typeof disabledTime === 'function' ? disabledTime() : {};
  const disHours = typeof disabled.disabledHours === 'function' ? disabled.disabledHours() : undefined;
  const disMinutes = typeof disabled.disabledMinutes === 'function' ? disabled.disabledMinutes() : undefined;
  const disSeconds = typeof disabled.disabledSeconds === 'function' ? disabled.disabledSeconds() : undefined;

  const options = [
    makeRange(minDate.getFullYear(), maxDate.getFullYear()),
    // makeRange(1, 12).map(v => ({ text: `${v}`, value: v - 1 })),
    getMonthsByYear({ year: currentValue.getFullYear(), minDate, maxDate }),
    getDaysByMonth({
      minDate, maxDate, year: currentValue.getFullYear(), month: currentValue.getMonth(),
    }),
    locale[props.locale].noon,
    makeRange(0, 12),
    makeRange(0, 23, 1, disHours),
    makeRange(0, 59, minuteStep, disMinutes),
    makeRange(0, 59, 1, disSeconds),
    dayYear,
    dayYear,
  ];
  return options;
}

/**
 * 过滤年份
 * @param { Array } arr
 * @param { object } disabledDateObj
 * @param { String } minDate
 */

function filterYear(arr, { disabledDateObj, minDate, maxDate }) {
  const minDateTime = new Date(minDate).getTime();
  const maxDateTime = new Date(maxDate).getTime();
  const yearRangeArr = getDateRangeArr(disabledDateObj, minDateTime, maxDateTime);
  const yearArr = [];
  yearRangeArr.forEach((item) => {
    let { start, end } = item;
    start = new Date(start);
    end = new Date(end);
    const yearStart = start.getFullYear();
    const monthStart = start.getMonth();
    const dayStart = start.getDate();
    const yearEnd = end.getFullYear();
    const monthEnd = end.getMonth();
    const dayEnd = new Date(end.getTime() + 86400000).getDate();
    if (monthStart === 0 && dayStart === 1) { // 判断临界时 是否去掉整年
      if (monthEnd === 11 && dayEnd === 1) {
        for (let i = yearStart; i <= yearEnd; i++) {
          yearArr.push(i);
        }
      } else {
        for (let i = yearStart; i < yearEnd; i++) {
          yearArr.push(i);
        }
      }
    }
    if (monthEnd === 11 && dayEnd === 1) {
      for (let i = yearStart + 1; i <= yearEnd; i++) {
        yearArr.push(i);
      }
    } else {
      for (let i = yearStart + 1; i < yearEnd; i++) {
        yearArr.push(i);
      }
    }
  });
  return arr.filter((item) => {
    const year = item.value;
    return yearArr.indexOf(year) === -1;
  });
}

/**
 * 过滤月份
 * @param { Array } arr
 * @param { Number } year
 * @param { object } disabledDateObj
 */

function filterMonth(arr, year, disabledDateObj) {
  const minDateTime = new Date(year, 0, 1).getTime();
  const maxDateTime = new Date(year, 11, 31).getTime();
  const monthRangeArr = getDateRangeArr(disabledDateObj, minDateTime, maxDateTime);
  const monthArr = [];
  monthRangeArr.forEach((item) => {
    let { start, end } = item;
    start = new Date(start);
    end = new Date(end);

    const monthStart = start.getMonth();
    const monthEnd = end.getMonth();
    const dayStart = start.getDate();
    const dayEnd = new Date(end.getTime() + 86400000).getDate();
    if (dayStart === 1) {
      if (dayEnd === 1) {
        for (let i = monthStart; i <= monthEnd; i++) {
          monthArr.push(i);
        }
      } else {
        for (let i = monthStart; i < monthEnd; i++) {
          monthArr.push(i);
        }
      }
    }
    if (dayEnd === 1) {
      for (let i = monthStart + 1; i <= monthEnd; i++) {
        monthArr.push(i);
      }
    } else {
      for (let i = monthStart + 1; i < monthEnd; i++) {
        monthArr.push(i);
      }
    }
  });
  return arr.filter((item) => {
    const month = item.value;
    return monthArr.indexOf(month) === -1;
  });
}

/**
 * 过滤日
 * @param { Array } arr
 * @param { Number } year
 * @param { Number } month
 * @param { object } disabledDateObj
 */
function filterDay(arr, year, month, disabledDateObj) {
  const minDateTime = new Date(year, month, 1).getTime();
  const maxDateTime = new Date(year, month + 1, 0).getTime();
  const dayRangeArr = getDateRangeArr(disabledDateObj, minDateTime, maxDateTime);
  const dayArr = [];
  dayRangeArr.forEach((item) => {
    let { start, end } = item;
    start = new Date(start).getDate();
    end = new Date(end).getDate();
    for (let i = start; i <= end; i++) {
      dayArr.push(i);
    }
  });
  return arr.filter((item) => {
    const day = item.value;
    return dayArr.indexOf(day) === -1;
  });
}

/**
 * 过滤YMDHM 和 YMDWHM 中的日列
 * @param { Array } arr
 * @param { Object } disabledDateObj
 */

function filterYMDDay(arr, disabledDateObj) {
  const newArr = [];
  const parseYMDValue = (value) => {
    const date = [];
    date[0] = (`${value}`).substring(0, 4);
    date[1] = (`${value}`).substring(4, 6) - 1;
    date[2] = (`${value}`).substring(6, 8);
    return new Date(...date).getTime();
  };
  const minDate = parseYMDValue(arr[0].value);
  const maxDate = parseYMDValue(arr[arr.length - 1].value);
  const dayRangeArr = getDateRangeArr(parseDisabledArr(disabledDateObj), minDate, maxDate);
  arr.forEach((item) => {
    const value = parseYMDValue(item.value);
    let shouldPass = true;
    for (let i = 0; i < dayRangeArr.length; i++) {
      const dis = dayRangeArr[i];
      const { start, end } = dis;
      if (value >= new Date(start).getTime() && value <= new Date(end).getTime()) {
        shouldPass = false;
        break;
      }
    }
    if (shouldPass) {
      newArr.push(item);
    }
  });
  return newArr;
}

/**
 * 初始化过滤
 * @param { Array } data
 * @param { Array } value
 * @param { fun } disabledDate
 * @param { String|NUmber } minDate
 * @param { String|NUmber } maxDate
 * @param { array } disabledArr
 */

function filterDate({
  data,
  value,
  disabledArr,
  minDate,
  maxDate,
  oldData = {},
  props,
  columns,
}) {
  const disabledArrNew = parseDisabledArr(disabledArr);
  if (columns[0] === 'Y') {
    const year = value[0].value;
    let month;
    let yearData = data[0];
    let monthData;
    if (columns.length >= 2) {
      monthData = getMonthsByYear({ year, minDate, maxDate }).map(item => ({
        value: item.value,
        text: `${addZero(item.text)}${locale[props.locale].surfix.M}`,
      }));
      month = value[1].value;
    }
    let dayData;
    if (columns.length >= 3) {
      dayData = getDaysByMonth({
        year, month, minDate, maxDate,
      });
    }
    if (disabledArrNew.startEnd || disabledArrNew.minTime || disabledArrNew.maxTime) {
      if (oldData.yearData) {
        ({ yearData } = oldData);
      } else {
        yearData = filterYear(yearData, { disabledDateObj: disabledArrNew, minDate, maxDate });
      }
      if (monthData) {
        if (oldData.monthData) {
          ({ monthData } = oldData);
        } else {
          const monthArr = filterMonth(monthData, year, disabledArrNew);
          monthData = monthArr.length ? monthArr : monthData;
        }
      }

      if (dayData) {
        const dayArr = filterDay(dayData, year, month, disabledArrNew);
        dayData = dayArr.length ? dayArr : dayData;
        const unit = locale[props.locale].surfix.D;
        dayData = dayData.map(item => ({
          ...item,
          text: addZero(item.text) + (unit || ''),
        }));
      }
    }
    if (disabledArrNew.minTime >= disabledArrNew.maxTime) {
      warn('Datetime: Please check your disabledDate props');
      return [];
    }
    if (!yearData.length) {
      return [];
    }
    const outArr = [yearData];
    if (monthData) {
      outArr.push(monthData);
      if (dayData) {
        outArr.push(dayData);
      }
    }

    if (data[3]) {
      outArr.push(data[3]);
    }
    return outArr;
  }
  if (['YMD', 'YMDW'].indexOf(columns[0]) !== -1) {
    const newData = [...data];
    newData[0] = filterYMDDay(newData[0], disabledArr);

    return newData;
  }
  return data;
}
function getSlotFormattedValue(value, props) {
  // 使用当前时间或传入时间作为默认值
  // 形成候选项
  const currentValueNew = parseValue(value);
  const options = getOptions(value, props);
  // 数据格式化
  const ret = Slot.formatDataValue([].concat(options), [].concat(currentValueNew));
  return formatFromProps(ret.value, props);
}

function needUpdateSlotValue(prevProps, nextProps) {
  const checkedProps = ['minDate', 'maxDate', 'minuteStep', 'columns', 'value'];
  return shouldUpdate(prevProps, nextProps, checkedProps);
}
export default {
  parseValue,
  addDayOfWeek,
  formatFromProps,
  formatText,
  getOptions,
  Slot,
  locale,
  filterDate,
  getSlotFormattedValue,
  needUpdateSlotValue,
};

