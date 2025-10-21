import httpRequest from '@/services/index';

class UsersService {
  public getTable = (params: Record<string, any>) => {
    return httpRequest.post('users/getTable', params);
  };

  public getFilters = () => {
    return httpRequest.get('users/getFilters');
  };

  public get = (id: string) => {
    return httpRequest.get(`users/${id}`);
  };

  public getGroups = () => {
    return httpRequest.get('users/getGroups');
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('users', data);
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`users/${id}`, data);
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('users', data);
  };
}

export default new UsersService();
