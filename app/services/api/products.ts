import httpRequest from '@/services/index';

class ProductService {
  public getTable = (id: string | number, params: Record<string, any>) => {
    return httpRequest.post(`products/categories/${id}/getTable`, params);
  };

  public getFilters = () => {
    return httpRequest.get('products/categories/filters');
  };

  public get = (id: string) => {
    return httpRequest.get(`products/categories/${id}`);
  };

  public create = (id: string | number, data: Record<string, any>) => {
    return httpRequest.post(`products/categories/${id}`, data);
  };

  public set = (id: string | number, data: Record<string, any>) => {
    return httpRequest.put(`products/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  public remove = (id: string | number, data: Record<string, any>) => {
    return httpRequest.delete(`products/categories/${id}`, data);
  };
}

export default new ProductService();
