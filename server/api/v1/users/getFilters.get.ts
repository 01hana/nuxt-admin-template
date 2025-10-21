import { userService } from '../../../services/users';

export default defineEventHandler(async () => {
  const data = await userService.getFilters();

  return data;
});
