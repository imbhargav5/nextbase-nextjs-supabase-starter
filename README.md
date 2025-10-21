# NextBase Starter

![NextBase Lite Open Source Free Boilerplate](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/.github/litebanner.png?raw=true)

Nextbase Lite is a simple Next.js 16 + Supabase boilerplate. It includes a Next.js 16 app with Typescript, Supabase and Tailwind CSS. It includes the all new `app` folder, `layout` components, React `server components` and more!

## Features

- 🚀 Next.js 16
- 💻 Data fetching examples in React server and client components. Suspenseful data fetching with minimal loading screens.
- ⚛️ React query setup configured
- 🔥 React Hot Toast component
- 💻 Fully typed with Typescript. Includes automatic type generation for Supabase tables
- 🎨 Tailwindcss
- 🧪 Unit testing and integration testing setups built-in
- 💚 Eslint, typescript, prettier, postcss configured for dev and test environments
- 📈 Automatic sitemap generation
- 🔍 SEO metadata, JSON-LD and Open Graph tags with NEXT SEO
- ✍️ Semantic release with Automatic changelog generation
- 🎨 Prettier Code formatter
- 💎 Minimal styling
- 📖 Codebase which is easy to read and modify

### Development

1. Clone the repo
2. Install dependencies with `pnpm install`
3. Create a Supabase account if you don't have one already
4. Create a new project in Supabase
5. Link Supabase to your project using `pnpm supabase link --project-ref <project-ref>`. You can get your project ref from the Supabase Project dashboard (Project Settings -> API)
6. Duplicate `.env.local.example` and rename it to `.env.local` and add the Project ref, Supabase URL and anon key.
7. Push the database schema to your Supabase project using `pnpm supabase db push`.
8. Generate types for your Supabase tables using `pnpm generate:types:local`.
9. Run `pnpm dev` to start the development server.

### Testing

1. Unit test using `pnpm test`
2. End-to-end test using `pnpm test:e2e`

### Deployment

This is a simple Next.js project. Deployment is the same as any other Next.js project. You can deploy it to Vercel, Netlify, or any other hosting provider.

### Contributing

Contributions are welcome. Please open an issue or a PR.

### License

MIT

### Troubleshooting

Checkout the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common issues.

## Premium NextBase Boilerplate

Also checkout our premium boilerplate with more features. It includes a fully functional authentication system, user profiles, organisations, row level security, and more.

[![NextBase Boilerplate](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter/blob/main/.github/banner.png?raw=true)](https://usenextbase.com)
