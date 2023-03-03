import urlJoin from 'url-join';
import MD5 from 'crypto-js/md5';

import md5 from 'md5';
import { NextApiRequest } from 'next';
import confetti from 'canvas-confetti';
import { z } from 'zod';

export const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const toSiteURL = (path: string) => {
  const url = getURL();
  return urlJoin(url, path);
};

export const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const getUserAvatarUrl = ({
  email,
  profileAvatarUrl,
}: {
  email: string;
  profileAvatarUrl?: string;
}) => {
  const placeholderAvatarUrl = `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp`;
  const fallbackAvatarUrl = `https://www.gravatar.com/avatar/${MD5(
    email
  )}?d=mp`;
  const isProfileAvatarUrlValid =
    profileAvatarUrl && profileAvatarUrl.length > 0;
  return isProfileAvatarUrlValid
    ? profileAvatarUrl
    : fallbackAvatarUrl ?? placeholderAvatarUrl;
};

export const msToTimestamp = (ms: number): string => {
  let milliseconds: number | string = Math.floor(ms % 1000);

  let seconds: number | string = Math.floor((ms / 1000) % 60),
    minutes: number | string = Math.floor((ms / (1000 * 60)) % 60),
    hours: number | string = Math.floor((ms / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  if (milliseconds < 10) {
    milliseconds = '00' + milliseconds;
  } else if (milliseconds < 100) {
    milliseconds = '0' + milliseconds;
  }

  if (hours === '00') {
    return minutes + ':' + seconds + '.' + milliseconds;
  }

  return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
};

export const extractDomainFromEmail = (email: string): string | null => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(String(email).toLowerCase())) {
    const domain = email.split('@')[1];
    return domain;
  }
  return null;
};

export const getGravatarImageUrl = (email: string): string => {
  return `https://www.gravatar.com/avatar/${md5(email)}?d=404`;
};

export const getPageTitle = (asPath: string): string => {
  let pathname = asPath;
  if (pathname === '/') {
    return 'Login | ' + APP_NAME;
  }

  if (pathname.indexOf('[') > -1) {
    return APP_NAME + ' Dashboard';
  }

  if (pathname.indexOf('?tab=')) {
    pathname = pathname.split('?tab=')[0];
  }

  let title = pathname.split('/').reverse().join(' | ') + APP_NAME;
  title = title.replace(/-/g, ' ');

  return titleCase(title);
};

export const titleCase = (str: string): string => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
};

export const isValidEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export function extractAuthTokenFromReq(req: NextApiRequest): string | null {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

export const fileToBase64 = (file: File): Promise<any> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getFileNameFromUrlOrPath = (urlOrPath: string): string => {
  const lastPart = urlOrPath.split('/').pop();
  if (!lastPart) {
    throw new Error('Invalid url or path');
  }
  return lastPart.split('?')[0];
};

export const getFileExtensionFromName = (fileName: string): string =>
  fileName.split('.')[fileName.split('.').length - 1].toLowerCase();

export const getFilenameWithoutExtension = (fileName: string): string =>
  fileName.replace(`.${getFileExtensionFromName(fileName)}`, '');

export const getMp4FileDurationFromBuffer = (buffer): number => {
  //throws incorrect duration for large files
  const header = Buffer.from('mvhd');
  const start = buffer.indexOf(header) + 17;
  const timeScale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);

  const length = Math.floor((duration / timeScale) * 1000) / 1000;
  return Math.floor(length);
};

export const getRunStatusMedia = (
  status: RUN_STATUS
): {
  color: string;
} => {
  switch (status) {
    case 'PENDING':
      return { color: 'yellow' };
    case 'SUCCESS':
      return { color: 'green' };
    case 'ERROR':
      return { color: 'red' };
    default:
      return { color: 'blue' };
  }
};

export const convertSecondsToVideoTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (hours < 1) {
    return (
      String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
    );
  }

  return (
    String(hours).padStart(2, '0') +
    ':' +
    String(minutes).padStart(2, '0') +
    ':' +
    String(seconds).padStart(2, '0')
  );
};

export const convertVideoTimeToSeconds = (videoTime: string): number => {
  // videoTime => 01:45:32.896
  const ms = parseInt(videoTime.split('.')[1]);
  const timeArr = videoTime.split('.')[0].split(':');
  const hrs = parseInt(timeArr.length === 3 ? timeArr[0] : '0');
  const mins = parseInt(timeArr.length === 3 ? timeArr[1] : timeArr[0]);
  const secs = parseInt(timeArr.reverse()[0]);

  const totalSecs = hrs * 60 * 60 + mins * 60 + secs + ms / 1000;
  return totalSecs;
};

export const isLocalHost = (): boolean => {
  if (
    typeof window !== undefined &&
    window.location.href.indexOf('localhost') === -1
  ) {
    return false;
  }
  return true;
};

export const splitArrayToHalves = (arr: any[]) => {
  const halfwayThrough = Math.floor(arr.length / 2);

  const arrayFirstHalf = arr.slice(0, halfwayThrough);
  const arraySecondHalf = arr.slice(halfwayThrough, arr.length);

  return {
    firstHalf: arrayFirstHalf,
    secondHalf: arraySecondHalf,
  };
};

export const timestampToMs = (timestamp: string): number => {
  const dotSplit = timestamp.split('.');
  let ms = parseInt(dotSplit[1]);
  const colonSplit = dotSplit[0].split(':');
  const seconds = parseInt(colonSplit[colonSplit.length - 1]);
  ms = ms + seconds * 1000;
  colonSplit.pop();

  if (colonSplit.length == 2) {
    ms = ms + parseInt(colonSplit[0]) * 60 * 60 * 1000;
    ms = ms + parseInt(colonSplit[1]) * 60 * 1000;
    return ms;
  }
  ms = ms + parseInt(colonSplit[0]) * 60 * 1000;
  return ms;
};

export const isValidTimestamp = (timestamp: string): boolean => {
  const regexExp = new RegExp('[0-9]{2}:[0-9]{2}.[0-9]{3}'); // mm:ss.mmm

  if (regexExp.test(timestamp)) {
    return true;
  }

  const regexExp2 = new RegExp('[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}'); // hh:mm:ss.mmm

  if (regexExp2.test(timestamp)) {
    return true;
  }

  return false;
};

export const realisticConfetti = () => {
  const count = 100;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: any, opts: any) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const normalizeS3FileName = (fileName: string): string =>
  fileName.replace(fileName.split('-')[0] + '-', '');

export const isFulfilled = <T>(
  p: PromiseSettledResult<T>
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';
export const isRejected = <T>(
  p: PromiseSettledResult<T>
): p is PromiseRejectedResult => p.status === 'rejected';

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);
