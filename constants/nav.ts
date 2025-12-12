import type { NavigationMenuItem } from '@nuxt/ui';

export const sideMenu = [
  {
    label: 'menu.dashboard',
    icon: 'solar:chart-2-outline',
    name: 'dashboard',
    to: '/',
  },
  {
    label: 'menu.customers',
    icon: 'fluent:people-list-24-regular',
    name: 'customers',
    to: '/customers',
  },
  {
    label: 'menu.products',
    icon: 'fluent:box-24-regular',
    name: 'products',
    to: '/products/categories',
  },
  {
    label: 'menu.orders',
    icon: 'fluent:cart-24-regular',
    name: 'orders',
    to: '/orders',
  },
  {
    label: 'menu.accounts',
    icon: 'fluent:people-24-regular',
    open: true,
    children: [
      {
        label: 'menu.accounts-groups',
        name: 'accounts-groups',
        to: '/accounts/groups',
      },
      {
        label: 'menu.accounts-users',
        name: 'accounts-users',
        to: '/accounts/users',
      },
    ],
  },
] satisfies NavigationMenuItem[];
