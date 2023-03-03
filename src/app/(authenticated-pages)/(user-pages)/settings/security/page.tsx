'use client';
import { Email } from '@/components/presentational/tailwind/Auth/Email';
import { Password } from '@/components/presentational/tailwind/Auth/Password';
import H3 from '@/components/presentational/tailwind/Text/H3';
import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import {
  useUpdatePassword,
  useUpdateUserEmailMutation,
} from '@/utils/react-query-hooks';

export default function SecuritySettings() {
  const updateEmailMutation = useUpdateUserEmailMutation();
  const updatePasswordMutation = useUpdatePassword({});
  const user = useLoggedInUser();
  return (
    <div className="space-y-8 max-w-xl">
      <div className="space-y-2">
        <H3>Security Settings</H3>
        <p className="text-sm text-gray-400">
          Manage your login credentials here.
        </p>
      </div>
      <div className="space-y-8">
        <Email
          isLoading={updateEmailMutation.isLoading}
          onSubmit={(email) => {
            updateEmailMutation.mutate({
              newEmail: email,
            });
          }}
          defaultValue={user.email}
          label="Update Email"
          withMaintenanceMode
          view="update-email"
        />
        <div className="space-y-1">
          <Password
            isLoading={updatePasswordMutation.isLoading}
            onSubmit={(password) => {
              updatePasswordMutation.mutate({
                password,
              });
            }}
            label="Update Password"
            withMaintenanceMode
            buttonLabel="Update password"
          />
        </div>
      </div>
    </div>
  );
}
