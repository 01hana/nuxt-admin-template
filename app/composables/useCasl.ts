import type { MongoAbility } from '@casl/ability';

export function useCasl(to: any) {
  const route = to;

  const { $ability } = useNuxtApp();

  const ability = $ability as MongoAbility;

  const routeName = computed(() => route.name as string);
  const hasAction = computed(() => can('update') || can('delete'));

  const can = (action: string, subject?: string) => {
    return ability.can(action, subject ?? routeName.value);
  };

  return {
    ability,
    hasAction,

    can,
  };
}
