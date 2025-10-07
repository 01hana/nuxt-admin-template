import httpRequest from '@/services/index';

class GroupsService {
  public getTable(params: Record<string, any>) {
    return httpRequest.post('groups/getTable', params);
  }

  public getFilters = () => {
    return httpRequest.get('groups/filters');
  };

  public get = (id: string) => {
    return httpRequest.get(`groups/${id}`);
  };

  public create = (data: Record<string, any>) => {
    return httpRequest.post('groups', data);
  };

  public set = (id: string, data: Record<string, any>) => {
    return httpRequest.put(`groups/${id}`, data);
  };

  public remove = (data: Record<string, any>) => {
    return httpRequest.delete('groups', data);
  };
}

export default new GroupsService();
