import { AppSupabaseClient, SupabaseFileUploadOptions } from '@/types';
import urlJoin from 'url-join';

export const uploadUserImage = async (
  supabaseClient: AppSupabaseClient,
  userId: string,
  file: File,
  fileName: string,
  fileOptions?: SupabaseFileUploadOptions | undefined
): Promise<{
  path: string;
}> => {
  const userImagesPath = `${userId}/images/${fileName}`;
  const { data, error } = await supabaseClient.storage
    .from('user-assets')
    .upload(userImagesPath, file, fileOptions);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const uploadPublicUserAvatar = async (
  supabaseClient: AppSupabaseClient,
  userId: string,
  file: File,
  fileName: string,
  fileOptions?: SupabaseFileUploadOptions | undefined
): Promise<string> => {
  const userImagesPath = `${userId}/images/${fileName}`;

  const { data, error } = await supabaseClient.storage
    .from('public-user-assets')
    .upload(userImagesPath, file, fileOptions);

  if (error) {
    throw new Error(error.message);
  }

  const { path } = data;

  const filePath = path.split(',')[0];
  const supabaseFileUrl = urlJoin(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    '/storage/v1/object/public/public-user-assets',
    filePath
  );
  return supabaseFileUrl;
};

export const uploadOrganizationImage = async (
  supabaseClient: AppSupabaseClient,
  organizationId: string,
  file: File,
  fileName: string,
  fileOptions?: SupabaseFileUploadOptions | undefined
): Promise<{
  path: string;
}> => {
  const organizationImages = `${organizationId}/images/${fileName}`;
  const { data, error } = await supabaseClient.storage
    .from('organization-assets')
    .upload(organizationImages, file, fileOptions);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
