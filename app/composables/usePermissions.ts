import { sideMenu } from '~~/constants/nav';

type PermissionAction = 'view' | 'create' | 'edit' | 'delete';
type ApiAction = 'read' | 'create' | 'update' | 'delete';

interface ApiPermission {
  subject: string;
  action: ApiAction;
}

const actionMap: Record<PermissionAction, ApiAction> = {
  view: 'read',
  create: 'create',
  edit: 'update',
  delete: 'delete',
};

export function usePermissions(t: (key: string) => string) {
  const defaultActions: { label: string; value: PermissionAction }[] = [
    {
      label: t('actions.view'),
      value: 'view',
    },
    {
      label: t('actions.create'),
      value: 'create',
    },
    {
      label: t('actions.edit'),
      value: 'edit',
    },
    {
      label: t('actions.remove'),
      value: 'delete',
    },
  ];

  const transSideMenu = computed(() =>
    sideMenu.map(item => ({
      ...item,
      label: t(item.label),
    })),
  );

  // 初始化 UI 狀態：每個 route 都有四個權限，預設 false
  const state = ref<Record<string, Record<PermissionAction, boolean>>>(
    Object.fromEntries(
      transSideMenu.value.map(route => [
        route.to,
        { view: false, create: false, edit: false, delete: false },
      ]),
    ),
  );

  function extractSubject(path: string) {
    return path.split('/').filter(Boolean).pop() || path;
  }

  // 將 UI 狀態轉換成後端需要的格式
  function toApi(): ApiPermission[] {
    const result: ApiPermission[] = [];

    for (const [to, actions] of Object.entries(state.value)) {
      for (const [actionKey, enabled] of Object.entries(actions)) {
        if (!enabled) continue;

        result.push({
          subject: extractSubject(to),
          action: actionMap[actionKey as PermissionAction],
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
      const uiPath = Object.keys(state.value).find(path => extractSubject(path) === subject);

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
