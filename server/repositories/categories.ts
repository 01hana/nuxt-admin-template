import { BaseRepository } from './base';

class CategoryRepository extends BaseRepository {
  constructor() {
    super(
      'categories',
      ['sort', 'updated_at'],
      ['name', 'sort'],
      ['name', 'sort', 'status', 'updated_at'],
    );

    this.useUUID = false;
  }

  private uniqueTranslate = {
    name: '類別名稱',
  };

  public async create(data: any) {
    await this.checkUnique(data, ['name'], this.uniqueTranslate);

    await this.insert(data);
  }

  public async updateCategory(id: string | number, data: any) {
    await this.checkUnique(data, ['name'], this.uniqueTranslate, id);

    await this.update(id, data);
  }
}

export const categoryRepository = new CategoryRepository();
