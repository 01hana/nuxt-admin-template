export default defineNuxtRouteMiddleware(async to => {
  const { getUser, setLoginState } = useAuth();
  const { user, isLoginState } = storeToRefs(useAuth());

  const { getLocalStorage } = useStorage();
  const { $updateAbility, $clearAbility } = useNuxtApp();
  const { can } = useCasl(to);

  const isEnterAuthRoute = to.meta.resource === 'auth';

  const accessToken = getLocalStorage('accessToken');

  const publicPages = ['/auth/login', '/auth/forgot', '/auth/reset'];

  const requiresAuth = !publicPages.some(page => to.path.includes(page));

  if (accessToken) {
    if (!isLoginState.value) {
      await getUser();

      $updateAbility(user.value?.permissions ?? []);
    }

    // const noPermission =
    //   !can('read', to.name as string) &&
    //   !['dashboard', 'accounts-profile'].includes(String(to.name));

    // if (noPermission) {
    //   throw showError({
    //     statusCode: 403,
    //     statusMessage: 'Forbidden - 您沒有權限進入此頁面',
    //   });
    // }
  }

  /**
   * 登入後重設登入狀態
   */
  if (requiresAuth && isLoginState.value && !isEnterAuthRoute) setLoginState(false);

  if (requiresAuth && !accessToken) {
    $clearAbility();

    return navigateTo('/auth/login');
  }

  // if (to.path.includes('/auth/reset') && !to.query.token) {
  //   return navigateTo('/auth/login');
  // }

  if (!requiresAuth && accessToken) {
    return navigateTo('/');
  }
});
