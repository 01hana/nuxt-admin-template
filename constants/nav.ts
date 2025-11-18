import type { NavigationMenuItem } from '@nuxt/ui';

export const sideMenu: NavigationMenuItem[] = [
  {
    label: 'menu.dashboard',
    icon: 'solar:chart-2-outline',
    to: '/',
  },
  {
    label: 'menu.customers',
    icon: 'fluent:people-list-24-regular',
    to: '/customers',
  },
  {
    label: 'menu.products',
    icon: 'fluent:box-24-regular',
    to: '/products',
  },
  {
    label: 'menu.orders',
    icon: 'fluent:cart-24-regular',
    to: '/orders',
  },
  {
    label: 'menu.accounts',
    icon: 'fluent:people-24-regular',
    open: true,
    children: [
      {
        label: 'menu.groups',
        to: '/accounts/groups',
      },
      {
        label: 'menu.users',
        to: '/accounts/users',
      },
    ],
  },
];
