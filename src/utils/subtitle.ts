import { KEY_LOCAL_STORAGE_MODIFIED_SUBTITLES } from '@/constants';
import { z } from 'zod';
import { msToTimestamp } from './helpers';

const textContentSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  speaker: z.number(),
});

const parsedSubtitleTextSchema = z.array(
  z.object({
    word: z.string(),
    start: z.number(),
    end: z.number(),
    confidence: z.number(),
    speaker: z.number(),
    textcontents: z.array(textContentSchema),
  })
);

export type ParsedSubtitleText = z.infer<typeof parsedSubtitleTextSchema>;

export const convertSubtitleArrayToVTT = (
  parsedSubtitles: ParsedSubtitleText
): string => {
  let subtitleText = 'WEBVTT' + '\n\n';
  // console.log(parsedSubtitles);
  parsedSubtitles.forEach((s) => {
    subtitleText =
      subtitleText +
      msToTimestamp(s.start * 1000) +
      ' --> ' +
      msToTimestamp(s.end * 1000) +
      '\n' +
      s.word +
      '\n\n';
  });

  return subtitleText;
};

export const addSubtitlesToVideo = (
  subtitleText: string,
  videoElement: HTMLVideoElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  videoTrack: any,
  cueArray: VTTCue[]
): void => {
  const parsedSubtitles = parsedSubtitleTextSchema.parse(
    JSON.parse(subtitleText)
  );
  cueArray = [];
  parsedSubtitles.forEach((s) => {
    const tmpCue = new VTTCue(s.start, s.end, s.word);
    cueArray.push(tmpCue);
    videoTrack.addCue(tmpCue);
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const removeSubtitlesFromVideo = (
  videoTrack: any,
  cueArray: VTTCue[]
): void => {
  cueArray.forEach((c) => {
    videoTrack.removeCue(c);
  });
};

export const saveParsedSubtitlesToLocalStorage = (
  parsedSubtitles: ParsedSubtitleText,
  runId: string
): void => {
  localStorage.setItem(
    KEY_LOCAL_STORAGE_MODIFIED_SUBTITLES(runId),
    JSON.stringify(parsedSubtitles)
  );
};

export const getParsedSubtitlesFromLocalStorage = (
  runId: string
): ParsedSubtitleText | null => {
  const tmp = localStorage.getItem(KEY_LOCAL_STORAGE_MODIFIED_SUBTITLES(runId));

  if (!tmp) {
    return null;
  }

  return JSON.parse(tmp);
};

export const convertVTTTimeToSRTTime = (timestamp: string): string => {
  let srtTime = timestamp;
  srtTime = srtTime.replace('.', ','); // replace millisecond seperator

  if (srtTime.split(':').length === 2) {
    srtTime = '00:' + srtTime; // add hours if there is no hours
  }

  return srtTime;
};

export const convertVTTStringToSRTString = (text: string): string => {
  const data = JSON.parse(text);
  let srtString = '';
  data.forEach((d, n) => {
    srtString = srtString + `${n + 1}\n`;
    srtString =
      srtString +
      `${convertVTTTimeToSRTTime(
        msToTimestamp(d.startTimeInMs)
      )} --> ${convertVTTTimeToSRTTime(msToTimestamp(d.endTimeInMs))}\n`;
    srtString = srtString + `${d.text}\n`;
    srtString = srtString + `\n`;
  });

  return srtString;
};

export const parsedSubtitlesToTranscript = (
  parsedSubtitleText: ParsedSubtitleText
): string => {
  let ts = parsedSubtitleText.map((ps) => ps.word).join(' ');
  const speakerMatches = ts.match(/(?<=\[).+?(?=:\])/g);
  if (speakerMatches) {
    speakerMatches.forEach((s) => {
      ts = ts.replace(new RegExp(`${s}:]`, 'g'), `\n\n\n\n[${s}]\n\n`);
      ts = ts.replace(' [\n\n\n\n', '\n\n\n\n');
    });
  }

  return ts;
};

export const ccLengthValidator = (
  text: string
): {
  message: string;
  color: 'red' | 'green';
} => {
  if (text.length > 82) {
    return {
      message: 'Recommended length: 82 chars',
      color: 'red',
    };
  }
  return {
    message: 'All good',
    color: 'green',
  };
};
