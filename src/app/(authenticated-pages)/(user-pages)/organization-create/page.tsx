import { PageHeading } from '@/components/presentational/tailwind/PageHeading/PageHeading';
import { CreateOrganization } from './CreateOrganization';

export default function CreateOrganizationPage() {
  return (
    <div className="space-y-6">
      <PageHeading title="Create Organization"></PageHeading>
      <CreateOrganization />
    </div>
  );
}
