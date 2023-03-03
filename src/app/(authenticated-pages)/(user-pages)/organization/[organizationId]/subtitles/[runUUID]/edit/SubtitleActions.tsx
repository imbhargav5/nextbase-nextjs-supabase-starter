import { T } from '@/components/ui/Typography';
import { ParsedSubtitleText } from '@/utils/subtitle';

export const SubtitleActions = ({
  currentSubtitleSection,
  parsedSubtitles,
}: {
  currentSubtitleSection: ParsedSubtitleText[number] | undefined;
  parsedSubtitles: ParsedSubtitleText;
}) => {
  if (currentSubtitleSection) {
    return (
      <div>
        <T.P>{currentSubtitleSection.word}</T.P>
      </div>
    );
  }
  return <div></div>;
};
