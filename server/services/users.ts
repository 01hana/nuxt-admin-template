import { userRepository } from '../repositories/users';
import { groupRepository } from '../repositories/groups';
import { appError } from '../utils/appError';
import { signSetupToken } from '../utils/jwt';
import { mailer } from '../utils/mailer';

export const userService = {
  async getTable(body: any) {
    const [sortField, sortOrder] = body.sort || ['updated_at', 'desc'];
    const keyword = body.searches?.keyword || '';
    const filters = body.filters || {};
    const p = Number(body.p) || 1;
    const length = Number(body.length) || 35;
    const offset = (p - 1) * length;

    // 先檢查是否有群組篩選
    const targetUserIds = await userRepository.findByGroups(filters.groups);

    // 根據篩選條件查詢主表資料
    const { data: users, total } = await userRepository.findAll({
      sortField,
      sortOrder,
      keyword,
      filters: filters,
      length,
      offset,
    });

    // 若有 groups 篩選，進一步過濾結果
    let filteredUsers = users;

    if (targetUserIds) {
      filteredUsers = users.filter((u: any) => targetUserIds!.includes(u.id));
    }

    if (!filteredUsers.length) {
      return { data: [], p, length, total: 0 };
    }

    // 取得使用者關聯群組資料
    const mergedData = await this.findUserGroups(filteredUsers);

    return {
      data: mergedData,
      p,
      length,
      total: filteredUsers ? filteredUsers.length : total,
    };
  },

  async findUserGroups(filterUsers: Record<string, any>[]) {
    // 抓出所有使用者 ID
    const userIds = filterUsers.map(user => user.id);

    // 查詢使用者群組
    const groupRows = await groupRepository.findByUserIds(userIds);

    const groupMap: Record<string, string[]> = {};

    for (const row of groupRows) {
      if (!groupMap[row.user_id]) groupMap[row.user_id] = [];

      groupMap[row.user_id].push(row.name);
    }

    // 合併群組與狀態轉換
    const mergedData = filterUsers.map((user: any) => ({
      ...user,
      status: user.status === 1 ? true : false,
      groups: groupMap[user.id] || [],
    }));

    return mergedData;
  },

  async get(id: string) {
    const data = await userRepository.findById(id);

    if (!data) return null;

    data.groups = await groupRepository.findByUserId(id);

    return data;
  },

  async getGroups() {
    const data = await groupRepository.getGroups();

    return data;
  },

  async getFilters() {
    const groups = await groupRepository.getGroups();

    const status = [
      { label: '啟用', value: true },
      { label: '停用', value: false },
    ];

    return { data: { groups: groups.data, status } };
  },

  async create(data: any) {
    const user = await userRepository.create(data);

    //  產生 setup token
    const setupToken = signSetupToken({ id: user?.id, account: user?.account, setup: true });

    //  首次登入設定密碼連結
    const config = useRuntimeConfig();
    const setupLink = `${config.FRONTEND_URL}/auth/login?token=${setupToken}`;

    // 寄信
    await mailer.sendMail({
      from: `"Your System" <${config.SMTP_USER}>`,
      to: data.email,
      subject: '請設定您的帳號密碼',
      html: `
        <p>您好，${data.name}：</p>
        <p>請點擊以下連結設定密碼：</p>
        <p><a href="${setupLink}">${setupLink}</a></p>
        <p>此連結 30 分鐘內有效。</p>
      `,
    });

    return user;
  },

  async update(id: string, data: any) {
    const result = await userRepository.updateUser(id, data);

    return result;
  },

  async delete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw appError(400, '缺少必要參數');
    }

    await userRepository.softDelete(ids);

    return { deleted: ids };
  },
};
