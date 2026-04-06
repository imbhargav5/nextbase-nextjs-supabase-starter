declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
      NODE_ENV: 'development' | 'production';
      SUPABASE_PROJECT_REF: string;
    }
  }
}

// eslint-disable-next-line prettier/prettier
export { };

