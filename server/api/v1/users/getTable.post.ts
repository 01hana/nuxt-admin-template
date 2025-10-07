import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  return await userService.getTable(body);
});
