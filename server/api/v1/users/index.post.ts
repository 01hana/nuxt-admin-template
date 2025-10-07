import { db } from '../../../utils/db';
import { userService } from '../../../services/users';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  const data = await userService.create(body);

  return { data };
  // const { account, name, groups, email, status } = body;

  // // 產生 user 的 UUID
  // const [[{ id }]]: any = await db.query('SELECT UUID_TO_BIN(UUID(), 1) AS id');

  // // 插入使用者
  // await db.query(
  //   `INSERT INTO users (id, account, name, email, status, created_at, updated_at)
  //    VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
  //   [id, account, name, email, status],
  // );

  // // 綁定群組
  // if (Array.isArray(groups) && groups.length > 0) {
  //   for (const groupId of groups) {
  //     await db.query(
  //       `INSERT INTO user_groups (user_id, group_id)
  //        VALUES (?, UUID_TO_BIN(?, 1))`,
  //       [id, groupId],
  //     );
  //   }
  // }

  // return {
  //   data: {
  //     id,
  //     account,
  //     name,
  //     email,
  //     status,
  //     groups,
  //   },
  // };
});
