import { groupService } from '../../../services/groups';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const { ids } = body;

  await groupService.delete(ids);

  return { success: true, deleted: ids };
});
