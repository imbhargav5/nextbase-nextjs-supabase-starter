import { CircleAlert } from 'lucide-react';
import type { ComponentType } from 'react';

import * as SocialIcons from '@/components/Auth/Icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { AuthProvider } from '@/types';

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const isDemo = true;

export const RenderProviders = <TProvider extends AuthProvider,>({
  providers,
  onProviderLoginRequested,
  isLoading,
}: {
  providers: TProvider[];
  onProviderLoginRequested: (provider: TProvider) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-4">
      {isDemo ? (
        <Alert>
          <CircleAlert aria-hidden="true" />
          <AlertTitle>Demo providers</AlertTitle>
          <AlertDescription>
            Connect OAuth providers in your local Supabase configuration to
            enable these options.
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-2.5">
        {providers.map((provider) => {
          const AuthIcon = SocialIcons[provider] as ComponentType;
          return (
            <Button
              key={provider}
              type="button"
              variant="outline"
              disabled={isLoading || isDemo}
              onClick={() => onProviderLoginRequested(provider)}
              className="w-full justify-center"
            >
              <AuthIcon />
              Continue with {capitalize(provider)}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
