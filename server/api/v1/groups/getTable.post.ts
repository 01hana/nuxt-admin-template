import { groupService } from '../../../services/groups';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  return await groupService.getTable(body);
});
