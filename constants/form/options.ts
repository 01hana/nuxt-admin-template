import type { RadioGroupItem } from '@nuxt/ui';

export const orderStatus = [
  { label: '待付款', id: 'pending' },
  { label: '已付款', id: 'paid' },
  { label: '已出貨', id: 'shipped' },
  { label: '已完成', id: 'completed' },
  { label: '已取消', id: 'cancelled' },
];

export const paymentMethods = [
  { label: '信用卡', id: 'credit' },
  { label: '貨到付款', id: 'cod' },
  { label: 'Line Pay', id: 'linepay' },
];

export const shippingMethods = [
  { label: '宅配', id: 'home' },
  { label: '超商取貨', id: 'store' },
];

export const genderOptions: RadioGroupItem[] = [
  { label: '男', id: 'male' },
  { label: '女', id: 'female' },
  { label: '不透露', id: 'unknown' },
];
