'use client';
import { RenderProviders } from '@/components/presentational/tailwind/Auth/RenderProviders';
import { useSignInWithProvider } from '@/utils/react-query-hooks';

export function SignUp() {
  const providerMutation = useSignInWithProvider();
  return (
    <div className="container h-full grid items-center text-left max-w-lg mx-auto overflow-auto">
      <div className="space-y-8 ">
        {/* <Auth providers={['twitter']} supabaseClient={supabase} /> */}
        <div className="space-y-2 ">
          <h1 className="text-2xl  text-gray-700">Sign Up</h1>
        </div>
        <RenderProviders
          providers={['google']}
          isLoading={providerMutation.isLoading}
          onProviderLoginRequested={(provider) => {
            providerMutation.mutate({
              provider,
            });
          }}
        />
      </div>
    </div>
  );
}
