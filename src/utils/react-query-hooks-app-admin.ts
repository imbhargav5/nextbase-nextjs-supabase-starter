/* ==================== */
/* ADMIN PANEL */
/* ==================== */

import {
  ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE,
  ADMIN_USER_LIST_VIEW_PAGE_SIZE,
} from '@/constants';
import {
  UnwrapPromise,
  AppAdminGetUsersPaginatedReturnType,
  AppAdminGetOrganizationsPaginatedReturnType,
} from '@/types';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';
import axios from 'axios';
import { useRef } from 'react';
import toast from 'react-hot-toast';

export const useGetUsersInfiniteQuery = (
  initialData: UnwrapPromise<AppAdminGetUsersPaginatedReturnType>,
  search?: string | undefined
) => {
  return useInfiniteQuery<UnwrapPromise<AppAdminGetUsersPaginatedReturnType>>(
    ['getAdminUsersPaginated', search],
    async ({ pageParam }) => {
      const path = `/api/app_admin/get-users-paginated/${pageParam}`;
      const pathWithQuery = search ? `${path}?search=${search}` : path;
      const response = await axios.get(pathWithQuery, {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    {
      getNextPageParam: (lastPage, _pages) => {
        const pageNumber = lastPage[0];
        const rows = lastPage[1];

        if (rows.length < ADMIN_USER_LIST_VIEW_PAGE_SIZE) return undefined;
        return pageNumber + 1;
      },
      initialData: {
        pageParams: [0],
        pages: [initialData],
      },
    }
  );
};

export const useGetOrganizationsInfiniteQuery = (
  initialData: UnwrapPromise<AppAdminGetOrganizationsPaginatedReturnType>,
  search?: string | undefined
) => {
  return useInfiniteQuery<
    UnwrapPromise<AppAdminGetOrganizationsPaginatedReturnType>
  >(
    ['getAdminOrganizationsPaginated', search],
    async ({ pageParam }) => {
      const path = `/api/app_admin/get-organizations-paginated/${pageParam}`;
      const pathWithQuery = search ? `${path}?search=${search}` : path;
      const response = await axios.get(pathWithQuery, {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    {
      getNextPageParam: (lastPage, _pages) => {
        const pageNumber = lastPage[0];
        const rows = lastPage[1];

        if (rows.length < ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE)
          return undefined;
        return pageNumber + 1;
      },
      initialData: {
        pageParams: [0],
        pages: [initialData],
      },
    }
  );
};

const getUserImpersonationUrl = async (userId: string) => {
  const fetchPath = `/api/app_admin/impersonate_user/${userId}`;
  const response = await axios.get<{
    url: string;
  }>(fetchPath, {
    method: 'GET',
    withCredentials: true,
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `Failed to fetch user impersonation url. Status: ${response.status}`
    );
  }

  return response.data;
};

export const useFetchUserImpersonationUrl = () => {
  const toastRef = useRef<string | null>(null);
  return useMutation((userId: string) => getUserImpersonationUrl(userId), {
    // don't cache
    cacheTime: 0,
    onMutate: () => {
      const toastId = toast.loading('Fetching login url...');
      toastRef.current = toastId;
    },
    onSuccess: (data) => {
      // You can optionally use a toast
      window.navigator.clipboard.writeText(data.url).then(() => {
        toast.success('Copied login url to clipboard', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      });
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch login url';
      toast.error('Failed to fetch login url ' + errorMessage, {
        id: toastRef.current ?? undefined,
      });
      toastRef.current = null;
    },
  });
};

export const useEnableMaintenanceModeMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);
  return useMutation(
    async () => {
      const path = `/api/app_admin/maintenance-mode/enable-maintenance-mode`;
      const response = await axios.get(path, {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Enabling maintenance mode...');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['getIsAppInMaintenanceMode']);

        onSuccess?.();
        toast.success('App is now in maintenance mode', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
      onError: (error) => {
        onError?.(error);
        toast.error('Failed to set app maintenance mode', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
      cacheTime: 0,
    }
  );
};

export const useDisableMaintenanceModeMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const toastRef = useRef<string | null>(null);

  return useMutation(
    async () => {
      const path = `/api/app_admin/maintenance-mode/disable-maintenance-mode`;
      const response = await axios.get(path, {
        withCredentials: true,
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    {
      onMutate: () => {
        const toastId = toast.loading('Disabling maintenance mode...');
        toastRef.current = toastId;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['getIsAppInMaintenanceMode']);

        onSuccess?.();
        toast.success('App is no longer in maintenance mode', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
      onError: (error) => {
        onError?.(error);
        toast.error('Failed to disable app maintenance mode', {
          id: toastRef.current ?? undefined,
        });
        toastRef.current = null;
      },
      cacheTime: 0,
    }
  );
};
