import { groupService } from '../../../services/groups';

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Group id is required' });
  }

  const data = await groupService.update(id, body);

  return { data };
});
