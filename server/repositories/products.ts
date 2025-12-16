import { BaseRepository } from './base';

class ProductRepository extends BaseRepository {
  constructor() {
    super(
      'products',
      ['sort', 'updated_at'],
      ['name', 'number'],
      [
        'category_id',
        'name',
        'number',
        'status',
        'stock',
        'price',
        'cover',
        'images',
        'updated_at',
      ],
    );

    this.useUUID = false;
  }

  private uniqueTranslate = {
    name: '商品名稱',
    number: '商品編號',
  };

  public async create(data: any) {
    await this.checkUnique(data, ['name', 'number'], this.uniqueTranslate);

    await this.insert(data);
  }

  public async updateCategory(id: string | number, data: any) {
    await this.checkUnique(data, ['name', 'number'], this.uniqueTranslate, id);

    await this.update(id, data);
  }
}

export const productRepository = new ProductRepository();
