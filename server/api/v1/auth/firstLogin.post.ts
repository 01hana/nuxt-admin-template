import { authService } from '../../../services/auth';
import { verifySetupToken } from '../../../utils/jwt';
import { appError } from '../../../utils/appError';

export default defineEventHandler(async event => {
  const { token } = await readBody(event);

  if (!token) {
    throw appError(401, '未提供驗證 Token');
  }

  // 使用 setup token 驗證
  const payload = verifySetupToken(token);

  if (!payload) {
    throw appError(401, '無效或過期的首次登入連結');
  }

  // 將 payload 塞入 context，讓 service 可以用
  event.context.user = payload;

  return await authService.firstLogin(event);
});
