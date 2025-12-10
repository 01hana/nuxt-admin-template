import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const currentUserId = event.context.user.id;

  return await userService.getTable(body, currentUserId);
});
