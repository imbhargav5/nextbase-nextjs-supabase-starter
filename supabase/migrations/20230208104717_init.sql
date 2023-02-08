CREATE TABLE IF NOT EXISTS public.items (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying not null,
  description character varying not null
);
