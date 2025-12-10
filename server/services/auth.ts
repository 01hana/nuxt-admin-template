import { authRepository } from '../repositories/auth';
import { userRepository } from '../repositories/users';
import { groupRepository } from '../repositories/groups';
import { permissionRepository } from '../repositories/permission';
import { appError } from '../utils/appError';
import bcrypt from 'bcrypt';

export const authService = {
  async login(body: any) {
    const { account, password } = body;

    const user = await userRepository.findByAccount(account);

    if (!user.password) {
      throw appError(400, '尚未設定密碼，請使用首次登入流程');
    }

    if (!user) {
      throw appError(400, '帳號或密碼錯誤');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw appError(400, '帳號或密碼錯誤');
    }

    // 停用帳號檢查
    if (!user.status) {
      throw appError(403, '此帳號已停用，請聯絡系統管理者');
    }

    const groups = await groupRepository.findByUserId(user.id);
    const permissions = await permissionRepository.findByUserId(user.id);

    const payload = {
      id: user.id,
      account: user.account,
      name: user.name,
      email: user.email,
      status: user.status === 1 ? true : false,
      groups,
      permissions,
    };

    const token = signAccessToken(payload);

    return {
      data: {
        token,
        user: payload,
      },
    };
  },

  async firstLogin(event: any) {
    const { account, password } = await readBody(event);
    const payload = event.context.user; // setupToken payload

    if (payload.account !== account) {
      throw appError(400, '帳號與驗證資訊不一致');
    }

    const user = await userRepository.findById(payload.id, { withPassword: true });

    if (!user) throw appError(404, '使用者不存在');

    if (user.password) {
      throw appError(400, '此帳號已設定過密碼，請直接登入');
    }

    const hashed = await bcrypt.hash(password, 10);

    await userRepository.update(user.id, { password: hashed });

    const groups = await groupRepository.findByUserId(user.id);
    const permissions = await permissionRepository.findByUserId(user.id);

    const loginPayload = {
      id: user.id,
      account: user.account,
      name: user.name,
      email: user.email,
      status: user.status === 1 ? true : false,
      groups,
      permissions,
    };

    const token = signAccessToken(loginPayload);

    return {
      data: {
        token,
        user: loginPayload,
      },
    };
  },

  async getUser(tokenPayload: any) {
    const user = await userRepository.findById(tokenPayload.id);
    const groups = await groupRepository.findByUserId(user.id);
    const permissions = await permissionRepository.findByUserId(user.id);

    if (!user) throw appError(401, '使用者不存在');

    return { data: { ...user, groups, permissions } };
  },
};
