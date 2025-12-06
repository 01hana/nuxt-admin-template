import { categoryService } from '../../../../services/categories';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  const data = await categoryService.update(id, body);

  return data;
});
