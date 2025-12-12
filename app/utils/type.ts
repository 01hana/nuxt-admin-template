import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

export type ToType =
  | string
  | RouteLocationAsRelativeGeneric
  | RouteLocationAsPathGeneric
  | undefined;

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';
