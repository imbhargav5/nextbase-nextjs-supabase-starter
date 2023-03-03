import { AuthProvider } from '@/types';
import * as SocialIcons from '@/components/presentational/tailwind/Auth/Icons';

function capitalize(word: string) {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}

export const RenderProviders = ({
  providers,
  onProviderLoginRequested,
  isLoading,
}: {
  providers: AuthProvider[];
  onProviderLoginRequested: (provider: AuthProvider) => void;
  isLoading: boolean;
}) => {
  return (
    <div className="space-y-2">
      {providers.map((provider) => {
        const AuthIcon = SocialIcons[provider];
        return (
          <button
            disabled={isLoading}
            onClick={() => onProviderLoginRequested(provider)}
            key={provider}
            className="flex text-black items-center justify-center space-x-4 border shadow-sm rounded w-96 bg-white  px-3 py-2 hover:bg-blue-100 hover:border-blue-600 hover:shadow"
          >
            <AuthIcon />
            <span>{capitalize(provider)}</span>
          </button>
        );
      })}
    </div>
  );
};
