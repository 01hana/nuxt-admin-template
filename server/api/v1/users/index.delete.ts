import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const { ids } = body;

  await userService.delete(ids);

  return { success: true, deleted: ids };
});
