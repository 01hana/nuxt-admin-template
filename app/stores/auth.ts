import AuthService from '@/services/api/auth';

export const useAuth = defineStore('auth', () => {
  const router = useRouter();
  const toast = useAppToast();

  const user = ref<Record<string, any> | null>();
  const isLoginState = shallowRef<boolean>(false);

  function setUser(data: Record<string, any>) {
    user.value = data;
  }

  function setToken(data: string) {
    const { setLocalStorage } = useStorage();

    setLocalStorage('accessToken', data);
  }

  function setLoginState(state: boolean) {
    isLoginState.value = state;
  }

  function firstLogin(data: { account: string; password: string }) {}

  async function login(data: { account: string; password: string }) {
    const { data: res } = await AuthService.login(data);

    setUser(res.user);
    setToken(res.token);
    setLoginState(true);

    router.push('/');
  }

  async function getUser() {
    if (isLoginState.value) return;

    const { data: res } = await AuthService.getUser();

    setUser(res);
  }

  function logout(t: any) {
    toast.success(`${t('auth.logoutSuccess')}`);

    clearAuth();
  }

  function clearAuth() {
    user.value = {};

    const { removeLocalStorage } = useStorage();

    removeLocalStorage('accessToken');

    router.push('/auth/login');
  }

  function $reset() {
    user.value = {};
    isLoginState.value = false;
  }

  return {
    user,
    isLoginState,

    setLoginState,
    getUser,
    firstLogin,
    login,
    logout,
    clearAuth,
    $reset,
  };
});
