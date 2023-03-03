import { useLoggedInUser } from '@/hooks/useLoggedInUser';
import { useRef, useState } from 'react';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { getUserAvatarUrl } from '@/utils/helpers';
import { PageHeading } from '../PageHeading';
import H3 from '../Text/H3';
import { Button } from '../Button';
import { classNames } from '@/utils/classNames';
const MotionImage = motion(Image);

export function UpdateAvatarAndNameBody({
  onSubmit,
  isLoading,
  onFileUpload,
  isUploading,
  profileAvatarUrl,
  profileFullname,
  isNewAvatarImageLoading,
  setIsNewAvatarImageLoading,
}: {
  profileAvatarUrl: string;
  isUploading: boolean;
  onSubmit: (fullName: string) => void;
  isLoading: boolean;
  onFileUpload?: (file: File) => void;
  profileFullname: string;
  isNewAvatarImageLoading: boolean;
  setIsNewAvatarImageLoading: (value: boolean) => void;
}) {
  const user = useLoggedInUser();
  const [fullName, setFullName] = useState(profileFullname);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarURL = getUserAvatarUrl({
    profileAvatarUrl,
    email: user.email,
  });
  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-2">
        <H3>Account Settings</H3>
        <p className="text-sm text-gray-400">
          Your personal account settings can be changed here. Upload your avatar
          and manage your other essential information!
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(fullName);
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Avatar</p>
            <div className="p-0 m-0">
              <label
                className="inline p-0 m-0 cursor-pointer"
                htmlFor="file-input"
              >
                <MotionImage
                  animate={{
                    opacity: isNewAvatarImageLoading ? [0.5, 1, 0.5] : 1,
                  }}
                  transition={
                    /* eslint-disable */
                    isNewAvatarImageLoading
                      ? {
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }
                      : undefined
                    /* eslint-enable */
                  }
                  onLoadingComplete={() => {
                    setIsNewAvatarImageLoading(false);
                  }}
                  onError={() => {
                    setIsNewAvatarImageLoading(false);
                  }}
                  loading="eager"
                  width={64}
                  height={64}
                  className="h-16 object-center object-cover w-16 border-2 border-gray-200 rounded-full"
                  src={avatarURL}
                  alt="avatarUrl"
                />
                <input
                  disabled={isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      onFileUpload?.(file);
                    }
                  }}
                  ref={fileInputRef}
                  type="file"
                  name="file-input"
                  id="file-input"
                  hidden
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Name</p>
            <div className="flex space-x-2 ">
              <input
                disabled={isLoading}
                className="flex-1 shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                type="text"
                required
              />
            </div>
          </div>
          <div className="flex justify-start space-x-2 pt-4">
            <Button
              withMaintenanceMode
              className={classNames(
                'flex w-full justify-center rounded border border-transparent py-2 px-4 text-sm font-medium  shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2',
                isLoading
                  ? 'bg-yellow-300  focus:ring-yellow-500 text-black'
                  : 'bg-blue-500 focus:ring-blue-500 hover:bg-blue-600  text-white'
              )}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
