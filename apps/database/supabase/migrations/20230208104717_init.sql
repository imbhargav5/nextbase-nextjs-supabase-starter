-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE TABLE IF NOT EXISTS public.items (
  created_at timestamp WITH time zone NOT NULL DEFAULT NOW(),
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name character varying NOT NULL,
  description character varying NOT NULL
);
