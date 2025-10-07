import { groupService } from '../../../services/groups';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const data = await groupService.create(body);

  return { data };
});
