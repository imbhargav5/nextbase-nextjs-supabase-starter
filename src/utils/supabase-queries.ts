import { BASE_URL, MAX_VIDEO_LENGTH_SEC } from '@/constants';
import {
  AppSupabaseClient,
  AuthProvider,
  CommentWithUser,
  DropzoneFile,
  Table,
} from '@/types';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
import urlJoin from 'url-join';
import { z } from 'zod';
import { errors } from './errors';
import {
  getFileExtensionFromName,
  isFulfilled,
  isRejected,
  jsonSchema,
  toSiteURL,
} from './helpers';

export const getActiveProductsWithPrices = async (
  supabase: AppSupabaseClient
) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (
  supabase: AppSupabaseClient,
  user: User,
  name: string
) => {
  await supabase
    .from('user_profiles')
    .update({
      full_name: name,
    })
    .eq('id', user.id);
};

export const getAllOrganizationsForUser = async (
  supabase: AppSupabaseClient
) => {
  const { data, error } = await supabase
    .from('organizations')
    .select(
      '*, organization_team_members(id,member_id,member_role, user_profiles(*)), subscriptions(id, prices(id,products(id,name)))'
    );
  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data || [];
};

export const getOrganizationById = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('organizations')
    // query team_members and team_invitations in one go
    .select('*')
    .eq('id', organizationId)
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const createOrganization = async (
  supabase: AppSupabaseClient,
  user: User,
  name: string
) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      title: name,
      created_by: user.id,
    })
    .select('*')
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const updateOrganizationTitle = async (
  supabase: AppSupabaseClient,
  organizationId: string,
  title: string
): Promise<Table<'organizations'>> => {
  const { data, error } = await supabase
    .from('organizations')
    .update({
      title,
    })
    .eq('id', organizationId)
    .select('*')
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const getTeamMembersInOrganization = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('organization_team_members')
    .select('*, user_profiles(*)')
    .eq('organization_id', organizationId);

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data || [];
};

export const getPendingTeamInvitationsInOrganization = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('organization_team_invitations')
    .select(
      '*, inviter:user_profiles!inviter_user_id(*), invitee:user_profiles!invitee_user_id(*)'
    )
    .eq('organization_id', organizationId)
    .eq('status', 'active');

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data || [];
};

export const getOrganizationSubscription = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('organization_id', organizationId)
    .in('status', ['trialing', 'active'])
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const getUserProfile = async (
  supabase: AppSupabaseClient,
  userId: string
): Promise<Table<'user_profiles'>> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export async function getIsAppAdmin(
  supabaseClient: AppSupabaseClient,
  authUser: User
): Promise<boolean> {
  const { data: isUserAppAdmin, error } = await supabaseClient
    .rpc('check_if_user_is_app_admin', {
      user_id: authUser.id,
    })
    .single();
  if (error) {
    throw error;
  }

  return isUserAppAdmin;
}

export const updateUserProfileNameAndAvatar = async (
  supabase: AppSupabaseClient,
  userId: string,
  {
    fullName,
    avatarUrl,
  }: {
    fullName?: string;
    avatarUrl?: string;
  }
) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
    })
    .eq('id', userId)
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

export const getUserOrganizationRole = async (
  supabase: AppSupabaseClient,
  userId: string,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('organization_team_members')
    .select('member_id, member_role')
    .eq('member_id', userId)
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

/* ==================== */
/* Maintenance mode */
/* ==================== */

export const getIsAppInMaintenanceMode = async (
  supabaseClient: AppSupabaseClient
): Promise<boolean> => {
  const { data, error } = await supabaseClient
    .rpc('is_app_in_maintenance_mode')
    .single();

  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

/* ==================== */
/* AUTH */
/* ==================== */

export const signInWithMagicLink = async (
  supabase: AppSupabaseClient,
  email: string
) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: toSiteURL('/dashboard'),
    },
  });

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

export const signInWithPassword = async (
  supabase: AppSupabaseClient,
  email: string,
  password: string
) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

export const resetPassword = async (
  supabase: AppSupabaseClient,
  email: string
) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

export const updatePassword = async (
  supabase: AppSupabaseClient,
  password: string
) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

export const signInWithProvider = async (
  supabase: AppSupabaseClient,
  provider: AuthProvider
) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: toSiteURL('/dashboard'),
    },
  });

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

export const signUp = async (
  supabase: AppSupabaseClient,
  email: string,
  password: string
) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: toSiteURL('/dashboard'),
    },
  });

  if (error) {
    errors.add(error.message);
    throw error;
  }
};

// ====================
// RUNS
// ====================

export const getRuns = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('organization_id', organizationId);
  if (error) {
    errors.add(error.message);
    throw error;
  }
  return data;
};

export const getRunByUUID = async (
  supabase: AppSupabaseClient,
  uuid: string
) => {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('uuid', uuid)
    .single();
  if (error) {
    errors.add(error.message);
    throw error;
  }
  return data;
};

export const getPendingRuns = async (
  supabase: AppSupabaseClient,
  organizationId: string
) => {
  const { data, error } = await supabase
    .from('runs')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', 'PENDING');
  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data;
};

const getSubtitlesSchema = z.object({
  original: z.string(),
  modified: z.string().nullable(),
  videoUrl: z.string(),
});

type GetSubtitlesType = z.infer<typeof getSubtitlesSchema>;

export const getSubtitles = async (
  runUUID: string
): Promise<GetSubtitlesType> => {
  try {
    const response = await axios.get(
      urlJoin(BASE_URL, `/api/storage/subtitles/${runUUID}/get`),
      {
        withCredentials: true,
      }
    );
    if (response.status !== 200) {
      throw new Error('Error getting subtitles');
    }
    const data = getSubtitlesSchema.parse(response.data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error parsing subtitles');
  }
};

export const uploadFile = async (
  file: DropzoneFile,
  organizationId: string
) => {
  console.log({ file });
  const videoElement = document.createElement('video');
  const fileURL = URL.createObjectURL(file);
  videoElement.src = fileURL;

  const videoDurationInSeconds = await new Promise<number>((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement.duration);
    };
  });

  if (videoDurationInSeconds > MAX_VIDEO_LENGTH_SEC) {
    throw new Error(
      `Video is too long. Length ${videoDurationInSeconds} exceeds max length of ${MAX_VIDEO_LENGTH_SEC} seconds.`
    );
  }

  const getS3DetailsResponse = await axios.post(
    `/api/storage/videos/s3-url`,
    {
      name: file.name,
      videoDurationInSeconds,
      organizationId,
    },
    {
      withCredentials: true,
    }
  );

  const s3DetailsSchema = z.object({
    s3UploadUrl: z.string(),
    s3FormData: z.object({}).passthrough(),
    videoDurationInSeconds: z.number(),
    fileKey: z.string(),
  });

  const s3Details = s3DetailsSchema.parse(getS3DetailsResponse.data);

  const form = new FormData();
  Object.keys(s3Details.s3FormData).forEach((key) =>
    form.append(key, s3Details.s3FormData[key])
  );
  form.append(
    'Content-Type',
    getFileExtensionFromName(file.name) === 'mp4' ? 'video/mp4' : 'audio/mp3'
  );
  form.append('file', file);

  await axios.request({
    method: 'post',
    url: s3Details.s3UploadUrl,
    data: form,
    headers: {
      'Content-Type': file.type,
    },
  });

  await axios.put(`/api/storage/videos/s3-url`, {
    name: s3Details.fileKey,
    videoDurationInSeconds,
    organizationId,
  });

  return {
    file,
    videoDurationInSeconds,
  };
};

// ====================
// SUBTITLE COMMENTS
// ====================

export const addRunComment = async (
  supabase: AppSupabaseClient,
  runUUID: string,
  text: string,
  userId: string
) => {
  const { error } = await supabase
    .from('run_comments')
    .insert({ run_uuid: runUUID, text, user_id: userId })
    .select('*')
    .single();
  if (error) {
    errors.add(error.message);
    throw error;
  }

  return true;
};

function normalizeComment(
  comments: Table<'run_comments'> & {
    user_profiles:
    | Table<'user_profiles'>
    | Array<Table<'user_profiles'>>
    | null;
  }
): CommentWithUser {
  const user_profiles = Array.isArray(comments.user_profiles)
    ? comments.user_profiles[0]
    : comments.user_profiles;
  if (!user_profiles) {
    throw new Error('No user profile found for comment');
  }

  return {
    ...comments,
    user_profile: user_profiles,
  };
}

export const getRunComments = async (
  supabase: AppSupabaseClient,
  runUUID: string
): Promise<Array<CommentWithUser>> => {
  const { data, error } = await supabase
    .from('run_comments')
    .select('*, user_profiles(*)')
    .eq('run_uuid', runUUID);
  if (error) {
    errors.add(error.message);
    throw error;
  }

  return data.map(normalizeComment);
};
