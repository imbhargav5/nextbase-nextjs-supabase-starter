'use client';
import { LoadingSpinner } from '@/components/presentational/tailwind/LoadingSpinner';
import { UpdateAvatarAndNameBody } from '@/components/presentational/tailwind/UpdateAvatarAndName';
import { Table } from '@/types';
import {
  useUpdateUserFullnameAndAvatarMutation,
  useUploadUserAvatarMutation,
  useUserProfile,
} from '@/utils/react-query-hooks';
import { useState } from 'react';

export function AccountSettings({
  userProfile: initialUserProfile,
}: {
  userProfile: Table<'user_profiles'>;
}) {
  const { data: userProfile, isLoading: isProfileLoading } =
    useUserProfile(initialUserProfile);
  const { mutate, isLoading } = useUpdateUserFullnameAndAvatarMutation({});
  // This loading state is for the new avatar image
  // being fetched from the server to the browser. At this point the
  // upload is complete, but the new image is not yet available to the browser.
  const [isNewAvatarImageLoading, setIsNewAvatarImageLoading] =
    useState<boolean>(false);

  const { mutate: upload, isLoading: isUploading } =
    useUploadUserAvatarMutation({
      onSuccess: (avatarUrl: string) => {
        setIsNewAvatarImageLoading(true);
        mutate({
          avatarUrl,
        });
      },
    });

  if (isProfileLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="max-w-2xl">
      <UpdateAvatarAndNameBody
        onSubmit={(fullName: string) => {
          mutate({
            fullName,
          });
        }}
        onFileUpload={(file: File) => {
          upload(file);
        }}
        isNewAvatarImageLoading={isNewAvatarImageLoading}
        setIsNewAvatarImageLoading={setIsNewAvatarImageLoading}
        isUploading={isUploading}
        isLoading={isLoading ?? isUploading}
        profileAvatarUrl={userProfile.avatar_url}
        profileFullname={userProfile.full_name}
      />
    </div>
  );
}
