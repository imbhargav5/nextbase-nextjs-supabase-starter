import {
  parsedSubtitleTextSchema,
  parsedSubtitleTextSchemaWithId,
} from './subtitle';
import { v4 } from 'uuid';

export function generatedParsedSubtitlesWithId(subtitleString: string) {
  const parsedSubtitles = parsedSubtitleTextSchema.parse(
    JSON.parse(subtitleString)
  );
  return parsedSubtitleTextSchemaWithId.parse(
    parsedSubtitles.map((s) => {
      return {
        ...s,
        id: v4(),
      };
    })
  );
}
