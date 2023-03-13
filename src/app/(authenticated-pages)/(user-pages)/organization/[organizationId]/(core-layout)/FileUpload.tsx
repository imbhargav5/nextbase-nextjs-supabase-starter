'use client';

import { useUploadFile } from '@/utils/react-query-hooks';
import { useOrganizationIdLayoutContext } from '../../OrganizationIdLayoutContext';
import { UploadMediaBox } from './UploadMediaBox';

export function FileUpload() {
  const { organizationId } = useOrganizationIdLayoutContext();
  const { mutate } = useUploadFile();
  return (
    <div>
      <UploadMediaBox
        onUpload={(files) => {
          files.forEach((file) => {
            mutate({
              file,
              organizationId,
            });
          });
        }}
      />
    </div>
  );
}
