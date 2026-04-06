-- Seed data for private_items table
-- This creates sample data for testing purposes
-- Insert test private_items with hardcoded UUIDs simulating different users
INSERT INTO public.private_items (id, name, description, created_at)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Project Alpha',
    'A comprehensive project management tool for agile teams',
    NOW() - INTERVAL '5 days'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Marketing Campaign Q4',
    'Strategic marketing initiatives for the fourth quarter',
    NOW() - INTERVAL '3 days'
  ),
  (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Product Launch Checklist',
    'Complete checklist for new product launch procedures',
    NOW() - INTERVAL '1 day'
  ),
  (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Team Building Activities',
    'Collection of team building exercises and activities',
    NOW() - INTERVAL '7 days'
  ),
  (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    'Technical Documentation',
    'Comprehensive technical documentation for the platform',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Seed demo authors in auth.users
INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'olivia@example.com',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Olivia Martin"}',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'liam@example.com',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Liam Patel"}',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'amelia@example.com',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Amelia Chen"}',
    crypt('Password123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Seed blog posts
INSERT INTO public.content_blog_posts (id, slug, title, excerpt, body, author_id, is_published, published_at, created_at)
VALUES
  (
    '44444444-4444-4444-9444-444444444444',
    'supabase-workflows-at-scale',
    'Supabase Workflows at Scale',
    'How we orchestrate Supabase workflows for multi-tenant platforms.',
    'Supabase workflows require robust patterns for scaling teams and data-heavy workloads. In this post we walk through connection pooling, background jobs, and schema design tactics that keep queries fast under load.',
    '11111111-1111-4111-8111-111111111111',
    true,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '12 days'
  ),
  (
    '55555555-5555-4555-9555-555555555555',
    'designing-nextjs-edge-experiences',
    'Designing Next.js Edge Experiences',
    'Blueprints for delivering personalized UX at the edge with Next.js 15.',
    'Edge rendering with Next.js 15 unlocks real-time personalization. We explore caching strategies, streaming responses, and how to pair Supabase RLS with middleware to keep sessions fast and secure.',
    '22222222-2222-4222-8222-222222222222',
    true,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '9 days'
  ),
  (
    '66666666-6666-4666-9666-666666666666',
    'tailwind-shadcn-design-systems',
    'Tailwind + shadcn/ui Design Systems',
    'Practical guide for building cohesive UI systems with Tailwind and shadcn/ui.',
    'Design systems thrive on consistency. Learn how to blend Tailwind, shadcn/ui primitives, and Radix accessibility helpers to ship interfaces that scale with your product roadmap.',
    '33333333-3333-4333-8333-333333333333',
    true,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '6 days'
  ),
  (
    '77777777-7777-4777-9777-777777777777',
    'caching-strategies-for-rsc',
    'Caching Strategies for RSC',
    'Patterns for caching React Server Component data safely.',
    'React Server Components shift the caching story. We cover memoization utilities, revalidation, and how to avoid serving stale personalized content across tenants.',
    '11111111-1111-4111-8111-111111111111',
    true,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '4 days'
  ),
  (
    '88888888-8888-4888-9888-888888888888',
    'shipping-reliable-server-actions',
    'Shipping Reliable Server Actions',
    'Lessons learned from production hardening of Next.js server actions.',
    'Server actions remove client round-trips but require great observability. In this walkthrough we explore logging, retries, and coupling actions with pgTap tests to catch regressions.',
    '22222222-2222-4222-8222-222222222222',
    true,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- Seed blog post comments
INSERT INTO public.content_blog_post_comments (id, blog_post_id, author_id, body, created_at)
VALUES
  (
    '99999999-9999-4999-9999-999999999999',
    '44444444-4444-4444-9444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'Loved the section on connection pooling—would enjoy a deep dive on pgBouncer with Supabase.',
    NOW() - INTERVAL '8 days'
  ),
  (
    'aaaaaaa1-aaaa-4aaa-9aaa-aaaaaaaaaaa1',
    '55555555-5555-4555-9555-555555555555',
    '33333333-3333-4333-8333-333333333333',
    'This aligns perfectly with our edge A/B testing strategy. Appreciate the checklist at the end.',
    NOW() - INTERVAL '6 days'
  ),
  (
    'aaaaaaa2-aaaa-4aaa-9aaa-aaaaaaaaaaa2',
    '66666666-6666-4666-9666-666666666666',
    '11111111-1111-4111-8111-111111111111',
    'Great reminder to document tokens for each primitive. The color recipes example is gold.',
    NOW() - INTERVAL '4 days'
  ),
  (
    'aaaaaaa3-aaaa-4aaa-9aaa-aaaaaaaaaaa3',
    '77777777-7777-4777-9777-777777777777',
    '22222222-2222-4222-8222-222222222222',
    'Could you expand on revalidation timing for incremental static regeneration?',
    NOW() - INTERVAL '2 days'
  ),
  (
    'aaaaaaa4-aaaa-4aaa-9aaa-aaaaaaaaaaa4',
    '88888888-8888-4888-9888-888888888888',
    '33333333-3333-4333-8333-333333333333',
    'The pgTap section is super actionable—thanks for the tips on arranging fixtures.',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;
