import fetch from 'node-fetch';
import { toQueryString } from './index';

export interface APIResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}

export interface QueryParams {
  collection_name?: string;
  owner?: string;
  state?: string;
  sender?: string;
  seller?: string;
  asset_id?: string;
  template_id?: string;
  limit?: number;
  sort?: string;
  order?: string;
  page?: number;
}

class NodeFetch<T = void, P = void> {
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private endpoint: string;

  private request = async (url: string, body?: string, method?: string) => {
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const isValidBody = body && Object.keys(body).length > 0;
      const fetchOptions: RequestInit = {
        headers,
        body: isValidBody ? body : null,
        method: method || 'GET',
      };
      const request = await fetch(url, fetchOptions);
      if (request.headers.get('content-type').includes('text')) {
        return {
          content: {
            status: request.status,
            statusText: request.statusText,
          },
        };
      }
      const response = await request.json();
      if (typeof response.error === 'object') {
        const { error, message } = response.error;
        return {
          error,
          message,
        };
      }
      return response;
    } catch (e) {
      return {
        error: e,
        message: e.message,
      };
    }
  };

  getOne = async (
    id: string,
    routeParameter?: string
  ): Promise<APIResponse<T>> => {
    const parameter = routeParameter || '';
    const url = process.env.NFT_ENDPOINT + this.endpoint + '/' + id + parameter;
    return this.request(url, null);
  };

  getAll = async (queryParams?: QueryParams): Promise<APIResponse<T[]>> => {
    const queryString =
      queryParams && Object.values(queryParams).length
        ? '?' + toQueryString(queryParams)
        : '';
    const url = process.env.NFT_ENDPOINT + this.endpoint + queryString;
    return this.request(url, null);
  };

  create = async (
    body: P,
    routeParameter?: string
  ): Promise<APIResponse<T>> => {
    const route = routeParameter || '';
    const url = process.env.NFT_ENDPOINT + this.endpoint + route;
    return this.request(url, JSON.stringify(body), 'POST');
  };

  put = async (body: Partial<P>): Promise<APIResponse<T>> => {
    const url = process.env.NFT_ENDPOINT + this.endpoint;
    return this.request(url, JSON.stringify(body), 'PUT');
  };

  patch = async (
    body: Partial<P>,
    routeParameter: string
  ): Promise<APIResponse<T>> => {
    const url = process.env.NFT_ENDPOINT + this.endpoint + routeParameter;
    return this.request(url, JSON.stringify(body), 'PATCH');
  };
}

export default NodeFetch;
