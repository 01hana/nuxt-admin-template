import { useStorage } from '@vueuse/core';
import { $fetch } from 'ofetch';

type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT';

class HttpRequest {
  private token = useStorage('accessToken', '');

  private getDefaultHeaders() {
    return {
      ...(this.token.value ? { Authorization: `Bearer ${this.token.value}` } : {}),
    };
  }

  private handleError(error: any) {
    const toast = useAppToast();

    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const message = error?.response?._data?.message || error.message;

    if (status === 401) {
      toast.error('登入閒置逾期，請重新登入');
      // TODO: 這裡可加 clearAuth()
      return;
    }

    toast.error(`${status || ''} ${statusText || ''} ${message || '未知錯誤'}`);
  }

  public async request<T = any>(
    url: string,
    method: Methods,
    data?: any,
    options?: any,
  ): Promise<T> {
    const headers = this.getDefaultHeaders();
    const config = useRuntimeConfig();

    const requestOptions: any = {
      baseURL: config.public.apiUrl || 'http://localhost:3000/api/v1/',
      method,
      headers,
      ...options,
    };

    if (method === 'GET') requestOptions.params = data;
    else requestOptions.body = data;

    try {
      return await $fetch<T>(url, requestOptions);
    } catch (error: any) {
      this.handleError(error);

      throw error;
    }
  }

  public get<T = any>(url: string, params?: any, options?: any) {
    return this.request<T>(url, 'GET', params, options);
  }

  public post<T = any>(url: string, data?: any, options?: any) {
    return this.request<T>(url, 'POST', data, options);
  }

  public put<T = any>(url: string, data?: any, options?: any) {
    return this.request<T>(url, 'PUT', data, options);
  }

  public delete<T = any>(url: string, data?: any, options?: any) {
    return this.request<T>(url, 'DELETE', data, options);
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
