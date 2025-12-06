import { categoryService } from '../../../../services/categories';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const ids = body?.ids;

  return categoryService.delete(ids);
});
