import { productService } from '../../../../../services/products';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'item id is required' });
  }

  const data = await productService.get(id);

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'item not found' });
  }

  return data;
});
