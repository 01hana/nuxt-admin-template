import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User id is required' });
  }

  const data = await userService.update(id, body);

  return data;
});
