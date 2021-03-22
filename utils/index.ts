import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import { QueryParams } from './node-fetch';
import { SHORTENED_TOKEN_PRECISION } from './constants';
dayjs.extend(utc);
dayjs.extend(timezone);

export const toQueryString = (queryObject: QueryParams): string => {
  const parts = [];
  for (const key in queryObject) {
    const value = queryObject[key];
    if (value && (typeof value === 'string' || typeof value === 'number')) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return parts.length ? parts.join('&') : '';
};

export const formatNumber = (numberString: string): string =>
  numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const asyncForEach = async (
  array: unknown[],
  callback: (element: unknown, index: number, array: unknown[]) => void
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const parseTimestamp = (timestamp: string): string => {
  if (timestamp) {
    return `${dayjs(+timestamp)
      .tz('America/Los_Angeles')
      .format('MMM DD, YYYY, h:mm A')} PST`;
  }
  return '';
};

export const addPrecisionDecimal = (
  number: string,
  precision: number
): string => {
  if (number && number.includes('.')) return number;
  if (number && number.length > precision) {
    const insertDecimalAtIndex = number.length - precision;
    return (
      number.slice(0, insertDecimalAtIndex) +
      '.' +
      number.slice(insertDecimalAtIndex)
    );
  }

  let prependZeros = '';
  for (let i = 0; i < precision - number.length; i++) {
    prependZeros += '0';
  }
  return `0.${prependZeros + number}`;
};

export const formatPrice = (amount: string): string =>
  parseFloat(
    parseFloat(amount).toFixed(SHORTENED_TOKEN_PRECISION)
  ).toLocaleString();
