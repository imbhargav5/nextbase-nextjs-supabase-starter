import { Button } from '@/components/ui/Button';

export const RequestApprovalButton = ({ onClick }) => {
  return (
    <Button variant="primary" size="sm" onClick={onClick}>
      Request Approval
    </Button>
  );
};
