import { categoryService } from '../../../../services/categories';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  return await categoryService.getTable(body);
});
