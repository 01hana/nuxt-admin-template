import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';
import { sideMenu } from '../../constants/nav';

type ToType = string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined;

/**
 * 確保所有 to 都能轉成乾淨 string path
 */
function resolveToPath(to: ToType): string {
  if (!to) return '';
  if (typeof to === 'string') return to;

  return to.path ?? '';
}

/**
 * /accounts/groups → accounts-groups
 */
function pathToName(path: string) {
  return (
    path
      .replace(/^\//, '') // 去掉開頭斜線
      .replace(/\//g, '-') || 'index'
  );
}

export function useNavigation() {
  const localePath = useLocalePath();
  const { t } = useI18n();

  function generateMenu() {
    return sideMenu.map(item => {
      const rawPath = resolveToPath(item.to);

      return {
        ...item,
        name: item.name ?? pathToName(rawPath),
        label: t(item.label as string),
        to: item.to ? localePath(item.to) : undefined,

        children: item.children?.map(child => {
          const childRawPath = resolveToPath(child.to);

          return {
            ...child,
            name: child.name ?? pathToName(childRawPath),
            label: t(child.label),
            to: child.to ? localePath(child.to) : undefined,
          };
        }),
      };
    });
  }

  const menu = computed(() => generateMenu());

  return { menu };
}
