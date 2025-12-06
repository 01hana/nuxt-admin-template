import { categoryService } from '../../../../services/categories';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const data = await categoryService.create(body);

  return { data };
});
