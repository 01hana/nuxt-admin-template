import { sideMenu } from '~~/constants/nav';
import type { NavigationMenuItem } from '@nuxt/ui';

type ApiAction = 'read' | 'create' | 'update' | 'delete';

interface ApiPermission {
  subject: string;
  action: ApiAction;
}

const actionMap = {
  view: 'read',
  create: 'create',
  edit: 'update',
  delete: 'delete',
} satisfies Record<PermissionAction, ApiAction>;

export function usePermissions(t: (key: string) => string) {
  const defaultActions = [
    { label: t('actions.view'), value: 'view' },
    { label: t('actions.create'), value: 'create' },
    { label: t('actions.edit'), value: 'edit' },
    { label: t('actions.remove'), value: 'delete' },
  ] satisfies { label: string; value: PermissionAction }[];

  const transSideMenu = computed<NavigationMenuItem[]>(() =>
    sideMenu.flatMap(item => {
      if (item.children) {
        return item.children.map(child => ({
          ...child,
          label: t(child.label as string),
        }));
      }

      return {
        ...item,
        label: t(item.label as string),
      };
    }),
  );

  // 初始化 UI 狀態：每個 route 都有四個權限，預設 false
  const state = ref<Record<string, Record<PermissionAction, boolean>>>(
    Object.fromEntries(
      transSideMenu.value.map(route => [
        route.name,
        { view: false, create: false, edit: false, delete: false },
      ]),
    ),
  );

  // 將 UI 狀態轉換成後端需要的格式
  function toApi(): ApiPermission[] {
    const result: ApiPermission[] = [];

    for (const [name, actions] of Object.entries(state.value)) {
      for (const actionKey of Object.keys(actions) as PermissionAction[]) {
        if (!actions[actionKey]) continue;

        result.push({
          subject: name,
          action: actionMap[actionKey],
        });
      }
    }

    return result;
  }

  // 從 API 載入後端資料，轉換成 UI 狀態
  function fromApi(apiPermissions: ApiPermission[]) {
    resetPermissions();

    // 套用 API 資料
    apiPermissions.forEach(({ subject, action }) => {
      const uiPath = Object.keys(state.value).find(path => path === subject);

      if (!uiPath) return;

      const uiAction = (Object.keys(actionMap) as PermissionAction[]).find(
        key => actionMap[key] === action,
      );

      if (uiAction && state.value[uiPath]) {
        state.value[uiPath][uiAction] = true;
      }
    });
  }

  function resetPermissions() {
    Object.keys(state.value).forEach(to => {
      const actions = state.value[to];

      if (actions) {
        Object.keys(actions).forEach(action => {
          actions[action as PermissionAction] = false;
        });
      }
    });
  }

  return {
    defaultActions,
    transSideMenu,
    state,

    toApi,
    fromApi,
    resetPermissions,
  };
}
