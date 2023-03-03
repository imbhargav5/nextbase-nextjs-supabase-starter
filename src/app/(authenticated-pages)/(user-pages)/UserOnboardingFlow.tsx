'use client';
import { UserOnboardingModal } from '@/components/presentational/tailwind/UserOnboardingModal';
import { Table } from '@/types';
import {
  useUpdateUserFullnameAndAvatarMutation,
  useUploadUserAvatarMutation,
} from '@/utils/react-query-hooks';
import { toast } from 'react-hot-toast';

export function UserOnboardingFlow({
  userProfile,
  onSuccess,
}: {
  userProfile: Table<'user_profiles'>;
  onSuccess: () => void;
}) {
  const { mutate, isLoading } = useUpdateUserFullnameAndAvatarMutation({
    onSuccess: () => {
      toast('Success updating user profile');
      onSuccess();
    },
    onError: () => {
      toast('Error updating user profile');
    },
  });

  const { mutate: upload, isLoading: isUploading } =
    useUploadUserAvatarMutation({
      onSuccess: (avatarUrl: string) => {
        mutate({
          avatarUrl,
        });
      },
      onError: () => {
        toast('Error uploading avatar');
      },
    });

  return (
    <UserOnboardingModal
      isOpen
      onSubmit={(fullName: string) => {
        mutate({
          fullName,
        });
      }}
      onFileUpload={(file: File) => {
        upload(file);
      }}
      profileAvatarUrl={userProfile.avatar_url}
      isUploading={isUploading}
      isLoading={isLoading ?? isUploading}
    />
  );
}
