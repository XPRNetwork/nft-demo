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
  precision: number,
  noCommas?: boolean
): string => {
  if (number && number.includes('.')) return formatThousands(number);
  if (number && number.length > precision) {
    const insertDecimalAtIndex = number.length - precision;
    const numberString =
      number.slice(0, insertDecimalAtIndex) +
      '.' +
      number.slice(insertDecimalAtIndex);
    if (noCommas) {
      return numberString;
    }
    return formatThousands(parseFloat(numberString).toString());
  }

  let prependZeros = '';
  for (let i = 0; i < precision - number.length; i++) {
    prependZeros += '0';
  }
  const numberString = `0.${prependZeros + number}`;
  if (noCommas) {
    return numberString;
  }
  return formatThousands(parseFloat(numberString).toString());
};

export const formatPrice = (priceString: string): string => {
  const [price, currency] = priceString.split(' ');
  const amount = formatThousands(
    parseFloat(price.replace(',', '')).toFixed(SHORTENED_TOKEN_PRECISION)
  );
  return `${amount} ${currency}`;
};

const formatThousands = (numberString: string): string => {
  const [integers, decimals] = numberString.split('.');
  let salePrice = parseFloat(integers.replace(',', '')).toLocaleString();
  salePrice = decimals ? salePrice + '.' + decimals : salePrice;
  return salePrice;
};
