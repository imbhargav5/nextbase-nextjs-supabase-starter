import { Button } from '@/components/ui/Button';

export const ApproveSubtitlesButton = ({ onClick }) => {
  return (
    <Button variant="primary" size="sm" onClick={onClick}>
      Approve Subtitles
    </Button>
  );
};
