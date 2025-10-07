import httpRequest from '@/services/index';

class CustomersService {
  public getTable = (params: Record<string, any>) => {
    return httpRequest.post('customers/getTable', params);
  };

  public getFilters = () => {
    return httpRequest.get('customers/filters');
  };

  public get = (id: string) => {
    return httpRequest.get(`customers/${id}`);
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('customers', data);
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`customers/${id}`, data);
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('customers', data);
  };
}

export default new CustomersService();
