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
