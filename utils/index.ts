import { QueryParams } from '../utils/node-fetch';

export const toQueryString = (queryObject: QueryParams): string => {
  const parts = [];
  for (const key in queryObject) {
    const value = queryObject[key];
    if (value && typeof value === 'string') {
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

export const addPrecisionDecimal = (
  number: string,
  precision: number
): string => {
  if (number.includes('.')) return number;
  if (number.length >= precision) {
    const insertDecimalAtIndex = number.length - precision;
    return (
      number.slice(0, insertDecimalAtIndex) +
      '.' +
      number.slice(insertDecimalAtIndex)
    );
  }
};
