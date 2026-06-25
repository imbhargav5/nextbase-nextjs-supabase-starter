import { getCurrentWorkspace } from '@/data/user/workspaces';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './OnboardingForm';

export default async function OnboardingPage() {
  const membership = await getCurrentWorkspace();
  if (membership?.workspace) {
    redirect('/inbox');
  }
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6">
      <OnboardingForm />
    </div>
  );
}
