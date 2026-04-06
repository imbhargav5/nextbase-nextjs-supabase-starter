import { Typography as T } from 'src/components/ui/Typography';

export default function AuthErrorPage() {
  return (
    <div>
      <T.H1>Authentication Error</T.H1>
      <T.P>An error occurred during authentication. Please try again.</T.P>
    </div>
  );
}
