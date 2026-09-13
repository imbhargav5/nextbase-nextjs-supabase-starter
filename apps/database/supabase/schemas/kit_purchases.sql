-- kit_purchases: one-time kit entitlements (written by Stripe webhook via service role)

CREATE TABLE IF NOT EXISTS public.kit_purchases (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  kit_slug text NOT NULL,
  stripe_checkout_session_id text NOT NULL,
  stripe_payment_intent_id text,
  amount_total integer,
  currency text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kit_purchases_pkey PRIMARY KEY (id),
  CONSTRAINT kit_purchases_stripe_checkout_session_id_key UNIQUE (stripe_checkout_session_id),
  CONSTRAINT kit_purchases_user_id_kit_slug_key UNIQUE (user_id, kit_slug)
);

CREATE INDEX IF NOT EXISTS idx_kit_purchases_user_id
  ON public.kit_purchases (user_id);

CREATE INDEX IF NOT EXISTS idx_kit_purchases_kit_slug
  ON public.kit_purchases (kit_slug);

ALTER TABLE public.kit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_kit_purchases ON public.kit_purchases
  FOR SELECT
  USING (auth.uid() = user_id);
