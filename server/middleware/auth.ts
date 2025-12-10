import { verifyAccessToken } from '../utils/jwt';
import { appError } from '../utils/appError';
import { userRepository } from '../repositories/users';

// 1. 定義不需要驗證的 API 路由前綴或完整路徑
// 例如：登入、註冊、忘記密碼等公開路由
const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/firstLogin', '/api/v1/auth/forgot'];

// 檢查當前 URL 是否以 publicRoutes 中的任一條規則開頭
function isPublicRoute(url: string | undefined): boolean {
  if (!url) return false;
  return publicRoutes.some(prefix => url.startsWith(prefix));
}

export default defineEventHandler(async event => {
  const url = event.node.req.url || '';

  // 只攔截 API，不攔截前端路由
  if (!url.startsWith('/api/')) return;

  if (isPublicRoute(url)) return;

  const header = getHeader(event, 'authorization');

  if (!header) {
    throw appError(401, '未登入');
  }

  const token = header.replace('Bearer ', '');
  const payload = verifyAccessToken(token) as Record<string, any>;

  if (!payload) throw appError(401, '登入逾時，請重新登入');

  const user = await userRepository.findById(payload.id);

  if (!user.status) throw appError(403, '此帳號已停用，請聯絡系統管理者');

  event.context.user = payload;
});
