import { productService } from '../../../../../services/products';

export default defineEventHandler(async event => {
  const categoryId = event.context.params!.id;
  const body = await readBody(event);

  return await productService.getTable(categoryId, body);
});
