import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'User id is required' });
  }

  const data = await userService.get(id);

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return data;
});
