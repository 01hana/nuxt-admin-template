import httpRequest from '@/services/index';

class ProductService {
  public getTable = (params: Record<string, any>) => {
    return httpRequest.post('products/getTable', params);
  };

  public getFilters = () => {
    return httpRequest.get('products/filters');
  };

  public get = (id: string) => {
    return httpRequest.get(`products/${id}`);
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('products', data);
  };
}

export default new ProductService();
