-- Migration 023: Mentor User Type
-- ADDITIVE: adds columns to existing profiles table

alter table public.profiles
add column if not exists is_mentor boolean default false,
add column if not exists mentor_bio text,
add column if not exists mentor_expertise text[] default '{}',
add column if not exists onboarding_completed text[] default '{}';