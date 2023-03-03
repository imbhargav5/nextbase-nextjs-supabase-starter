import { View } from '@/types';

export type AppAdminGetUsersPaginatedReturnType = Promise<
  [number, Array<View<'app_admin_view_all_users'>>]
>;
