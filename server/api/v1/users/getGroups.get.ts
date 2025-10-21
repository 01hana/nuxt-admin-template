import { userService } from '../../../services/users';

export default defineEventHandler(async () => {
  const data = await userService.getGroups();

  return data;
});
