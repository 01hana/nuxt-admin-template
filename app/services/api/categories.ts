import httpRequest from '@/services/index';

class CategoryService {
  public getTable(params: Record<string, any>) {
    return httpRequest.post('products/categories/getTable', params);
  }

  public get = (id: string) => {
    return httpRequest.get(`products/categories/${id}`);
  };

  public getCategories = () => {
    return httpRequest.get('products/categories');
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('products/categories', data);
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`products/categories/${id}`, data);
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('products/categories', data);
  };
}

export default new CategoryService();
