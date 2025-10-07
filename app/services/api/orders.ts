import httpRequest from '@/services/index';

class OrdersService {
  public getTable = (params: Record<string, any>) => {
    return httpRequest.post('orders/getTable', params);
  };

  public getFilters = () => {
    return httpRequest.get('orders/filters');
  };

  public get = (id: string) => {
    return httpRequest.get(`orders/${id}`);
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('orders', data);
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`orders/${id}`, data);
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('orders', data);
  };
}

export default new OrdersService();
