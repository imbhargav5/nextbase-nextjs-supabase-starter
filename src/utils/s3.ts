import {
  DeleteObjectsCommand,
  ListObjectsCommand,
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import cuid from 'cuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getFileExtensionFromName, getFilenameWithoutExtension } from './file';
import { MAX_VIDEO_SIZE_MB } from '@/constants';

// export const getS3BucketName = () =>
//     `${AWS_S3_CLIENTS_ASSETS_BUCKET_PREFIX}-${
//         process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
//     }`;

export const getS3Instance = (accelerate?: boolean): S3Client => {
  const s3 = new S3Client({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_VALUE,
      secretAccessKey: process.env.AWS_SECRET_KEY_VALUE,
    },
    useAccelerateEndpoint: !!accelerate,
  });
  return s3;
};

export const deleteS3Directory = async (folderName: string): Promise<void> => {
  const bucketName = ``;
  const s3 = getS3Instance();
  const resp = await s3.send(
    new ListObjectsCommand({
      Bucket: bucketName,
      Prefix: folderName,
    })
  );

  if (!resp.Contents?.length) {
    return;
  }
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: resp.Contents.map((c) => {
          return {
            Key: c.Key,
          };
        }),
      },
    })
  );
};

export const generateS3FileKey = (fileName: string): string => {
  const fn = getFilenameWithoutExtension(fileName).replace(
    /[^a-zA-Z0-9]/g,
    '-'
  );
  const ext = getFileExtensionFromName(fileName);
  return `${cuid()}-${fn}.${ext}`;
};

export const generateS3FileDownloadLink = async (
  bucketName: string,
  fileKey: string,
  expiresInSeconds: number,
  accelerate?: boolean
): Promise<string> => {
  const s3 = getS3Instance(!!accelerate);
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

  return url;
};

export const generateS3UploadLink = async (
  bucketName: string,
  fileKey: string,
  expiresInSeconds: number,
  accelerate?: boolean
): Promise<string> => {
  const s3 = getS3Instance(!!accelerate);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: expiresInSeconds });

  return url;
};

export const generateS3SignedPOST = async (
  bucketName: string,
  fileKey: string,
  expiresInSeconds: number,
  accelerate?: boolean
): Promise<{
  url: string;
  fields: {
    [key: string]: unknown;
  };
}> => {
  const s3 = getS3Instance(!!accelerate);

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: bucketName,
    Key: fileKey,
    Conditions: [
      ['content-length-range', 0, MAX_VIDEO_SIZE_MB * 1024 * 1024],
      {
        'Content-Type':
          getFileExtensionFromName(fileKey) === 'mp4'
            ? 'video/mp4'
            : 'audio/mp3',
      },
    ],
    Fields: {},
    Expires: expiresInSeconds,
  });

  return { url, fields };
};

export const checkIfS3FileExists = async (
  fileKey: string,
  bucketName: string
): Promise<boolean> => {
  const s3 = getS3Instance();
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });
  try {
    const response = await s3.send(command);
    return response.$metadata.httpStatusCode === 200;
  } catch (error) {
    // console.log('unable to find the fileKey: ' + fileKey);
    // console.log(error);
    return false;
  }
};

export const getSubtitlesString = async (
  fileKey: string,
  bucketName: string
): Promise<string> => {
  const s3 = getS3Instance();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });
  const streamToString = (stream): Promise<string> =>
    new Promise((resolve, reject) => {
      const chunks: Array<Uint8Array> = [];
      stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  try {
    const response = await s3.send(command);
    const bodyContents = await streamToString(response.Body);
    return bodyContents;
  } catch {
    throw new Error("Subtitle file doesn't exist");
  }
};
