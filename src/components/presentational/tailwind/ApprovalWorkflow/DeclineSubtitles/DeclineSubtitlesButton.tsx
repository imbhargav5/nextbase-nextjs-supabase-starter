import { Button } from '@/components/ui/Button';

export const DeclineSubtitlesButton = ({ onClick }) => {
  return (
    <Button variant="destructive" size="sm" onClick={onClick}>
      Decline Subtitles
    </Button>
  );
};
