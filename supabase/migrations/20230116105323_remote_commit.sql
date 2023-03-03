--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it
ALTER SCHEMA "public" OWNER TO "postgres";
--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- Name: wrappers; Type: EXTENSION; Schema: -; Owner: -
--

-- CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";
--
-- Name: maintenance_status; Type: TYPE; Schema: public; Owner: supabase_admin
--

-- CREATE TYPE "public"."maintenance_status" AS ENUM ('inactive', 'active', 'scheduled');
-- ALTER TYPE "public"."maintenance_status" OWNER TO "supabase_admin";
--
-- Name: pricing_plan_interval; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."pricing_plan_interval" AS ENUM ('day', 'week', 'month', 'year');
ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";
--
-- Name: pricing_type; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."pricing_type" AS ENUM ('one_time', 'recurring');
ALTER TYPE "public"."pricing_type" OWNER TO "postgres";
--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."subscription_status" AS ENUM (
--   'trialing',
--   'active',
--   'canceled',
--   'incomplete',
--   'incomplete_expired',
--   'past_due',
--   'unpaid'
-- );
ALTER TYPE "public"."subscription_status" OWNER TO "postgres";
--
-- Name: team_invitation_link_status; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."team_invitation_link_status" AS ENUM (
--   'active',
--   'finished_accepted',
--   'finished_declined',
--   'inactive'
-- );
ALTER TYPE "public"."team_invitation_link_status" OWNER TO "postgres";
--
-- Name: team_joining_status; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."team_joining_status" AS ENUM (
--   'invited',
--   'joinied',
--   'declined_invitation',
--   'joined'
-- );
ALTER TYPE "public"."team_joining_status" OWNER TO "postgres";
--
-- Name: team_member_role; Type: TYPE; Schema: public; Owner: postgres
--

-- CREATE TYPE "public"."team_member_role" AS ENUM ('owner', 'admin', 'member');
ALTER TYPE "public"."team_member_role" OWNER TO "postgres";
--
-- Name: check_if_authenticated_user_owns_email(character varying); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

-- CREATE FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) RETURNS boolean LANGUAGE "plpgsql" SECURITY DEFINER AS $_$ BEGIN -- Check if the email exists in the auth.users table
-- -- and if the id column matches the auth.uid() function
-- IF EXISTS (
--   SELECT *
--   FROM auth.users
--   WHERE auth.users.email = $1
--     AND id = auth.uid()
-- ) THEN RETURN true;
-- ELSE RETURN false;
-- END IF;
-- END;
-- $_$;
-- ALTER FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) OWNER TO "supabase_admin";
--
-- Name: check_if_user_is_app_admin("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."check_if_user_is_app_admin"("user_id" "uuid") RETURNS boolean LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN -- Check if the given user ID exists in the app_admins table
RETURN EXISTS (
  SELECT 1
  FROM auth.users
  WHERE id = user_id
    AND auth.users.is_super_admin = true
);
END;
$$;
ALTER FUNCTION "public"."check_if_user_is_app_admin"("user_id" "uuid") OWNER TO "postgres";
--
-- Name: disable_maintenance_mode(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."disable_maintenance_mode"() RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
UPDATE app_settings
SET maintenance_status = 'inactive'
WHERE true;
END;
$$;
-- ALTER FUNCTION "public"."disable_maintenance_mode"() OWNER TO "supabase_admin";
--
-- Name: enable_maintenance_mode(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."enable_maintenance_mode"() RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
UPDATE app_settings
SET maintenance_status = 'active'
WHERE true;
END;
$$;
-- ALTER FUNCTION "public"."enable_maintenance_mode"() OWNER TO "supabase_admin";
--
-- Name: get_organization_team_admin_ids("uuid"); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") RETURNS TABLE("member_id" "uuid") LANGUAGE "plpgsql" SECURITY DEFINER AS $_$ BEGIN -- This function returns the member_id column for all rows in the organization_team_members table
-- where the organization_id column matches the organization_id argument.
RETURN QUERY
SELECT organization_team_members.member_id
FROM organization_team_members
WHERE organization_team_members.organization_id = $1
  and (
    member_role = 'admin'
    or member_role = 'owner'
  );
END;
$_$;
-- ALTER FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") OWNER TO "supabase_admin";
--
-- Name: get_organization_team_member_ids("uuid"); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") RETURNS TABLE("member_id" "uuid") LANGUAGE "plpgsql" SECURITY DEFINER AS $_$ BEGIN -- This function returns the member_id column for all rows in the organization_team_members table
-- where the organization_id column matches the organization_id argument.
RETURN QUERY
SELECT organization_team_members.member_id
FROM organization_team_members
WHERE organization_team_members.organization_id = $1;
END;
$_$;
-- ALTER FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") OWNER TO "supabase_admin";
--
-- Name: handle_add_team_member_after_invitation_accepted(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$BEGIN
INSERT INTO organization_team_members(member_id, member_role, organization_id)
VALUES (
    NEW.invitee_user_id,
    'member',
    NEW.organization_id
  );
RETURN NEW;
END;
$$;
-- ALTER FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() OWNER TO "supabase_admin";
--
-- Name: handle_auth_user_created(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_auth_user_created"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
INSERT INTO public.user_profiles (id)
VALUES (NEW.id);
INSERT INTO public.user_private_info (id)
VALUES (NEW.id);
RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."handle_auth_user_created"() OWNER TO "postgres";
--
-- Name: handle_create_team_for_auth_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_create_team_for_auth_user"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$BEGIN
INSERT INTO public.organizations (created_by)
VALUES (NEW.id);
RETURN NEW;
END;
$$;
ALTER FUNCTION "public"."handle_create_team_for_auth_user"() OWNER TO "postgres";
--
-- Name: handle_create_team_owner_on_organization_creation(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."handle_create_team_owner_on_organization_creation"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$BEGIN
INSERT INTO public.organization_team_members(organization_id, member_id, member_role)
VALUES(NEW.id, NEW.created_by, 'owner');
RETURN NEW;
END $$;
-- ALTER FUNCTION "public"."handle_create_team_owner_on_organization_creation"() OWNER TO "supabase_admin";
--
-- Name: handle_organization_created(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."handle_organization_created"() RETURNS "trigger" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
INSERT INTO public.organizations_private_info (id)
VALUES (NEW.id);
RETURN NEW;
END;
$$;
-- ALTER FUNCTION "public"."handle_organization_created"() OWNER TO "supabase_admin";
--
-- Name: is_app_in_maintenance_mode(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."is_app_in_maintenance_mode"() RETURNS boolean LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN RETURN(
  SELECT EXISTS(
      SELECT 1
      from app_settings
      where maintenance_status = 'active'
    )
);
END;
$$;
-- ALTER FUNCTION "public"."is_app_in_maintenance_mode"() OWNER TO "supabase_admin";
--
-- Name: is_app_not_in_maintenance_mode(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION "public"."is_app_not_in_maintenance_mode"() RETURNS boolean LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN RETURN(
  SELECT EXISTS(
      SELECT 1
      from app_settings
      where maintenance_status != 'active'
    )
);
END;
$$;
-- ALTER FUNCTION "public"."is_app_not_in_maintenance_mode"() OWNER TO "supabase_admin";
--
-- Name: make_user_app_admin("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."make_user_app_admin"("user_id" "uuid") RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
UPDATE auth.users
SET is_super_admin = true
WHERE id = user_id;
END;
$$;
ALTER FUNCTION "public"."make_user_app_admin"("user_id" "uuid") OWNER TO "postgres";
--
-- Name: remove_app_admin_privilege_for_user("uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."remove_app_admin_privilege_for_user"("user_id" "uuid") RETURNS "void" LANGUAGE "plpgsql" SECURITY DEFINER AS $$ BEGIN
UPDATE auth.users
SET is_super_admin = false
WHERE id = user_id;
END;
$$;
ALTER FUNCTION "public"."remove_app_admin_privilege_for_user"("user_id" "uuid") OWNER TO "postgres";
SET default_tablespace = '';
SET default_table_access_method = "heap";
--
-- Name: organization_team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."organization_team_members" (
  "id" bigint NOT NULL,
  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
  "member_id" "uuid" NOT NULL,
  "member_role" "public"."team_member_role" NOT NULL,
  "organization_id" "uuid" NOT NULL
);
ALTER TABLE "public"."organization_team_members" OWNER TO "postgres";
--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."organizations" (
  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
  "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
  "title" character varying DEFAULT 'Test Organization'::character varying NOT NULL,
  "created_by" "uuid" NOT NULL
);
ALTER TABLE "public"."organizations" OWNER TO "postgres";
--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."user_profiles" (
  "id" "uuid" NOT NULL,
  "full_name" character varying,
  "avatar_url" character varying
);
ALTER TABLE "public"."user_profiles" OWNER TO "postgres";
--
-- Name: app_admin_view_all_organizations; Type: VIEW; Schema: public; Owner: supabase_admin
--

CREATE VIEW "public"."app_admin_view_all_organizations" AS
SELECT "p"."id",
  "p"."created_at",
  "p"."title",
  (
    SELECT "count"(*) AS "count"
    FROM "public"."organization_team_members"
    WHERE (
        "organization_team_members"."organization_id" = "p"."id"
      )
  ) AS "team_members_count",
  (
    SELECT "up"."full_name"
    FROM (
        "public"."user_profiles" "up"
        JOIN "public"."organization_team_members" "tm" ON (("tm"."member_id" = "up"."id"))
      )
    WHERE (
        (
          "tm"."member_role" = 'owner'::"public"."team_member_role"
        )
        AND ("tm"."organization_id" = "p"."id")
      )
    LIMIT 1
  ) AS "owner_full_name",
  (
    SELECT "au"."email"
    FROM (
        "auth"."users" "au"
        JOIN "public"."organization_team_members" "tm" ON (("tm"."member_id" = "au"."id"))
      )
    WHERE (
        (
          "tm"."member_role" = 'owner'::"public"."team_member_role"
        )
        AND ("tm"."organization_id" = "p"."id")
      )
    LIMIT 1
  ) AS "owner_email"
FROM "public"."organizations" "p";
-- ALTER TABLE "public"."app_admin_view_all_organizations" OWNER TO "supabase_admin";
--
-- Name: app_admin_view_all_users; Type: VIEW; Schema: public; Owner: supabase_admin
--

CREATE VIEW "public"."app_admin_view_all_users" AS
SELECT "users"."id",
  "users"."email",
  "users"."created_at",
  "users"."updated_at",
  "user_profiles"."full_name",
  "user_profiles"."avatar_url",
  (
    SELECT "public"."check_if_user_is_app_admin"("users"."id") AS "check_if_user_is_app_admin"
  ) AS "is_app_admin",
  "users"."confirmed_at",
  CASE
    WHEN ("users"."confirmed_at" IS NOT NULL) THEN true
    ELSE false
  END AS "is_confirmed"
FROM (
    "auth"."users"
    JOIN "public"."user_profiles" ON (("users"."id" = "user_profiles"."id"))
  );
-- ALTER TABLE "public"."app_admin_view_all_users" OWNER TO "supabase_admin";
--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."app_settings" (
  "id" bigint NOT NULL,
  "maintenance_status" "public"."maintenance_status" DEFAULT 'inactive'::"public"."maintenance_status",
  "scheduled_maintenance_ends_at" timestamp with time zone,
  "maintenance_message" "text"
);
-- ALTER TABLE "public"."app_settings" OWNER TO "supabase_admin";
--
-- Name: app_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."app_settings"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."app_settings_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."customers" (
  "stripe_customer_id" character varying NOT NULL,
  "organization_id" "uuid" NOT NULL
);
ALTER TABLE "public"."customers" OWNER TO "postgres";
--
-- Name: organization_team_invitations; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."organization_team_invitations" (
  "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
  "inviter_user_id" "uuid" NOT NULL,
  "status" "public"."team_invitation_link_status" DEFAULT 'active'::"public"."team_invitation_link_status" NOT NULL,
  "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
  "invitee_user_email" character varying NOT NULL,
  "organization_id" "uuid" NOT NULL,
  "invitee_user_id" "uuid"
);
-- ALTER TABLE "public"."organization_team_invitations" OWNER TO "supabase_admin";
--
-- Name: organizations_private_info; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."organizations_private_info" (
  "id" "uuid" NOT NULL,
  "billing_address" "json",
  "payment_method" "json"
);
-- ALTER TABLE "public"."organizations_private_info" OWNER TO "supabase_admin";
--
-- Name: prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."prices" (
  "id" character varying NOT NULL,
  "product_id" character varying,
  "active" boolean,
  "description" character varying,
  "unit_amount" bigint,
  "currency" character varying,
  "type" "public"."pricing_type",
  "interval" "public"."pricing_plan_interval",
  "interval_count" bigint,
  "trial_period_days" bigint,
  "metadata" "jsonb"
);
ALTER TABLE "public"."prices" OWNER TO "postgres";
--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."products" (
  "id" character varying NOT NULL,
  "active" boolean,
  "name" character varying,
  "description" character varying,
  "image" character varying,
  "metadata" "jsonb"
);
ALTER TABLE "public"."products" OWNER TO "postgres";
--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."subscriptions" (
  "id" character varying NOT NULL,
  "status" "public"."subscription_status",
  "metadata" "json",
  "price_id" character varying,
  "quantity" bigint,
  "cancel_at_period_end" boolean,
  "created" timestamp with time zone NOT NULL,
  "current_period_start" timestamp with time zone NOT NULL,
  "current_period_end" timestamp with time zone NOT NULL,
  "ended_at" timestamp with time zone,
  "cancel_at" timestamp with time zone,
  "canceled_at" timestamp with time zone,
  "trial_start" timestamp with time zone,
  "trial_end" timestamp with time zone,
  "organization_id" "uuid"
);
ALTER TABLE "public"."subscriptions" OWNER TO "postgres";
--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."organization_team_members"
ALTER COLUMN "id"
ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."team_members_id_seq" START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
  );
--
-- Name: user_private_info; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."user_private_info" (
  "id" "uuid" NOT NULL,
  "created_at" timestamp with time zone DEFAULT "now"()
);
-- ALTER TABLE "public"."user_private_info" OWNER TO "supabase_admin";
--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."app_settings"
ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id");
--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."customers"
ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("stripe_customer_id", "organization_id");
--
-- Name: customers customers_stripe_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."customers"
ADD CONSTRAINT "customers_stripe_customer_id_key" UNIQUE ("stripe_customer_id");
--
-- Name: prices price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."prices"
ADD CONSTRAINT "price_pkey" PRIMARY KEY ("id");
--
-- Name: products product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."products"
ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");
--
-- Name: organizations_private_info projects_private_info_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organizations_private_info"
ADD CONSTRAINT "projects_private_info_pkey" PRIMARY KEY ("id");
--
-- Name: subscriptions subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."subscriptions"
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");
--
-- Name: organization_team_invitations team_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organization_team_invitations"
ADD CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id");
--
-- Name: organization_team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."organization_team_members"
ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("id");
--
-- Name: organizations teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."organizations"
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
--
-- Name: user_private_info user_private_info_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."user_private_info"
ADD CONSTRAINT "user_private_info_pkey" PRIMARY KEY ("id");
--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."user_profiles"
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");
--
-- Name: one_row_only_uidx; Type: INDEX; Schema: public; Owner: supabase_admin
--

CREATE UNIQUE INDEX "one_row_only_uidx" ON "public"."app_settings" USING "btree" ((true));
--
-- Name: organizations on_organization_created; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "on_organization_created"
AFTER
INSERT ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."handle_organization_created"();
--
-- Name: organizations on_organization_created_create_owner; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "on_organization_created_create_owner"
AFTER
INSERT ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."handle_create_team_owner_on_organization_creation"();
--
-- Name: organization_team_invitations on_team_invitation_accepted_trigger; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "on_team_invitation_accepted_trigger"
AFTER
UPDATE ON "public"."organization_team_invitations" FOR EACH ROW
  WHEN (
    (
      ("old"."status" <> "new"."status")
      AND (
        "new"."status" = 'finished_accepted'::"public"."team_invitation_link_status"
      )
    )
  ) EXECUTE FUNCTION "public"."handle_add_team_member_after_invitation_accepted"();
--
-- Name: customers customers_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."customers"
ADD CONSTRAINT "customers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");
--
-- Name: organization_team_invitations organization_team_invitations_invitee_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organization_team_invitations"
ADD CONSTRAINT "organization_team_invitations_invitee_user_id_fkey" FOREIGN KEY ("invitee_user_id") REFERENCES "public"."user_profiles"("id");
--
-- Name: organization_team_invitations organization_team_invitations_inviter_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organization_team_invitations"
ADD CONSTRAINT "organization_team_invitations_inviter_user_id_fkey" FOREIGN KEY ("inviter_user_id") REFERENCES "public"."user_profiles"("id");
--
-- Name: organization_team_invitations organization_team_invitations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organization_team_invitations"
ADD CONSTRAINT "organization_team_invitations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");
--
-- Name: organization_team_members organization_team_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."organization_team_members"
ADD CONSTRAINT "organization_team_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."user_profiles"("id");
--
-- Name: organization_team_members organization_team_members_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."organization_team_members"
ADD CONSTRAINT "organization_team_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");
--
-- Name: organizations organizations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."organizations"
ADD CONSTRAINT "organizations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id");
--
-- Name: organizations_private_info organizations_private_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."organizations_private_info"
ADD CONSTRAINT "organizations_private_info_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."organizations"("id");
--
-- Name: prices prices_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."prices"
ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");
--
-- Name: subscriptions subscriptions_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."subscriptions"
ADD CONSTRAINT "subscriptions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");
--
-- Name: subscriptions subscriptions_price_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."subscriptions"
ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id");
--
-- Name: user_private_info user_private_info_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."user_private_info"
ADD CONSTRAINT "user_private_info_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");
--
-- Name: user_profiles user_profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."user_profiles"
ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");
--
-- Name: products Active products are visible to everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Active products are visible to everyone" ON "public"."products" FOR
SELECT USING (("active" = true));
--
-- Name: organizations All authenticated users can create organizations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "All authenticated users can create organizations" ON "public"."organizations" FOR
INSERT TO "authenticated" WITH CHECK ("public"."is_app_not_in_maintenance_mode"());
--
-- Name: organizations All team members can read organizations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "All team members can read organizations" ON "public"."organizations" FOR
SELECT TO "authenticated" USING (
    (
      ("auth"."uid"() = "created_by")
      OR (
        "auth"."uid"() IN (
          SELECT "public"."get_organization_team_member_ids"("organizations"."id") AS "get_organization_team_member_ids"
        )
      )
    )
  );
--
-- Name: organizations All team members can update organizations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "All team members can update organizations" ON "public"."organizations" FOR
UPDATE TO "authenticated" USING (
    (
      (
        "auth"."uid"() IN (
          SELECT "public"."get_organization_team_member_ids"("organizations"."id") AS "get_organization_team_member_ids"
        )
      )
      AND "public"."is_app_not_in_maintenance_mode"()
    )
  );
--
-- Name: user_profiles Any team mate can view a user's public profile ; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Any team mate can view a user's public profile " ON "public"."user_profiles" FOR
SELECT TO "authenticated" USING (
    (
      EXISTS (
        SELECT 1
        FROM "public"."organization_team_members"
        WHERE (
            (
              "organization_team_members"."member_id" = "auth"."uid"()
            )
            AND (
              "organization_team_members"."organization_id" IN (
                SELECT "organization_team_members_1"."organization_id" AS "organization_id"
                FROM "public"."organization_team_members" "organization_team_members_1"
                WHERE (
                    "organization_team_members_1"."member_id" = "user_profiles"."id"
                  )
              )
            )
          )
      )
    )
  );
--
-- Name: organization_team_invitations Anyone can view; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Anyone can view" ON "public"."organization_team_invitations" FOR
SELECT USING (true);
--
-- Name: app_settings Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."app_settings" FOR
SELECT USING (true);
--
-- Name: subscriptions Everyone team member can view the subscription on  organization; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Everyone team member can view the subscription on  organization" ON "public"."subscriptions" FOR
SELECT TO "authenticated" USING (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_member_ids"("subscriptions"."organization_id") AS "get_organization_team_member_ids"
      )
    )
  );
--
-- Name: organization_team_members Only team admins can insert new members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only team admins can insert new members" ON "public"."organization_team_members" FOR
INSERT TO "authenticated" WITH CHECK (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_admin_ids"("organization_team_members"."organization_id") AS "get_organization_team_admin_ids"
      )
    )
  );
--
-- Name: organization_team_invitations Only team admins can invite other users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only team admins can invite other users" ON "public"."organization_team_invitations" FOR
INSERT TO "authenticated" WITH CHECK (
    (
      (
        "auth"."uid"() IN (
          SELECT "public"."get_organization_team_admin_ids"(
              "organization_team_invitations"."organization_id"
            ) AS "get_organization_team_admin_ids"
        )
      )
      AND "public"."is_app_not_in_maintenance_mode"()
    )
  );
--
-- Name: organization_team_members Only team admins can update team members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only team admins can update team members" ON "public"."organization_team_members" FOR
UPDATE TO "authenticated" USING (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_admin_ids"("organization_team_members"."organization_id") AS "get_organization_team_admin_ids"
      )
    )
  );
--
-- Name: organizations Only team admins/owners can delete organizations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only team admins/owners can delete organizations" ON "public"."organizations" FOR DELETE TO "authenticated" USING (
  (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_admin_ids"("organizations"."id") AS "get_organization_team_admin_ids"
      )
    )
    AND "public"."is_app_not_in_maintenance_mode"()
  )
);
--
-- Name: organizations_private_info Only team owners/admins can update private organizations info; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only team owners/admins can update private organizations info" ON "public"."organizations_private_info" FOR
UPDATE TO "authenticated" USING (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_admin_ids"("organizations_private_info"."id") AS "get_organization_team_admin_ids"
      )
    )
  );
--
-- Name: organizations_private_info Only team owners/admins can view private organizations info; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only team owners/admins can view private organizations info" ON "public"."organizations_private_info" FOR
SELECT TO "authenticated" USING (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_admin_ids"("organizations_private_info"."id") AS "get_organization_team_admin_ids"
      )
    )
  );
--
-- Name: organization_team_invitations Only the invited user can edit the invitation; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only the invited user can edit the invitation" ON "public"."organization_team_invitations" FOR
UPDATE TO "authenticated" USING (
    "public"."check_if_authenticated_user_owns_email"("invitee_user_email")
  );
--
-- Name: user_profiles Only the own user can update it; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only the own user can update it" ON "public"."user_profiles" FOR
UPDATE TO "authenticated" USING (
    (
      ("auth"."uid"() = "id")
      AND "public"."is_app_not_in_maintenance_mode"()
    )
  );
--
-- Name: user_private_info Only the user can update their private information; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only the user can update their private information" ON "public"."user_private_info" FOR
UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));
--
-- Name: user_private_info Only the user can view their private information; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only the user can view their private information" ON "public"."user_private_info" FOR
SELECT TO "authenticated" USING (("auth"."uid"() = "id"));
--
-- Name: prices Prices of active products are visible; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Prices of active products are visible" ON "public"."prices" FOR
SELECT USING (true);
--
-- Name: organization_team_members Team members can view other team members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Team members can view other team members" ON "public"."organization_team_members" FOR
SELECT TO "authenticated" USING (
    (
      "auth"."uid"() IN (
        SELECT "public"."get_organization_team_member_ids"("organization_team_members"."organization_id") AS "get_organization_team_member_ids"
      )
    )
  );
--
-- Name: app_settings; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."app_settings" ENABLE ROW LEVEL SECURITY;
--
-- Name: customers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;
--
-- Name: organization_team_invitations; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."organization_team_invitations" ENABLE ROW LEVEL SECURITY;
--
-- Name: organization_team_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."organization_team_members" ENABLE ROW LEVEL SECURITY;
--
-- Name: organizations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;
--
-- Name: organizations_private_info; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."organizations_private_info" ENABLE ROW LEVEL SECURITY;
--
-- Name: prices; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;
--
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;
--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;
--
-- Name: user_private_info; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."user_private_info" ENABLE ROW LEVEL SECURITY;
--
-- Name: user_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;
--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA "public"
FROM PUBLIC;
GRANT ALL ON SCHEMA "public" TO PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
--
-- Name: FUNCTION "check_if_authenticated_user_owns_email"("email" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_if_authenticated_user_owns_email"("email" character varying) TO "service_role";
--
-- Name: FUNCTION "check_if_user_is_app_admin"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."check_if_user_is_app_admin"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_if_user_is_app_admin"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_if_user_is_app_admin"("user_id" "uuid") TO "service_role";
--
-- Name: FUNCTION "disable_maintenance_mode"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."disable_maintenance_mode"() TO "postgres";
GRANT ALL ON FUNCTION "public"."disable_maintenance_mode"() TO "service_role";
--
-- Name: FUNCTION "enable_maintenance_mode"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."enable_maintenance_mode"() TO "postgres";
GRANT ALL ON FUNCTION "public"."enable_maintenance_mode"() TO "service_role";
--
-- Name: FUNCTION "get_organization_team_admin_ids"("organization_id" "uuid"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") TO "postgres";
GRANT ALL ON FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_organization_team_admin_ids"("organization_id" "uuid") TO "service_role";
--
-- Name: FUNCTION "get_organization_team_member_ids"("organization_id" "uuid"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") TO "postgres";
GRANT ALL ON FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_organization_team_member_ids"("organization_id" "uuid") TO "service_role";
--
-- Name: FUNCTION "handle_add_team_member_after_invitation_accepted"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_add_team_member_after_invitation_accepted"() TO "service_role";
--
-- Name: FUNCTION "handle_auth_user_created"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_auth_user_created"() TO "service_role";
--
-- Name: FUNCTION "handle_create_team_for_auth_user"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."handle_create_team_for_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_create_team_for_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_create_team_for_auth_user"() TO "service_role";
--
-- Name: FUNCTION "handle_create_team_owner_on_organization_creation"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."handle_create_team_owner_on_organization_creation"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_create_team_owner_on_organization_creation"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_create_team_owner_on_organization_creation"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_create_team_owner_on_organization_creation"() TO "service_role";
--
-- Name: FUNCTION "handle_organization_created"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."handle_organization_created"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_organization_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_organization_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_organization_created"() TO "service_role";
--
-- Name: FUNCTION "is_app_in_maintenance_mode"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."is_app_in_maintenance_mode"() TO "postgres";
GRANT ALL ON FUNCTION "public"."is_app_in_maintenance_mode"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_app_in_maintenance_mode"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_app_in_maintenance_mode"() TO "service_role";
--
-- Name: FUNCTION "is_app_not_in_maintenance_mode"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."is_app_not_in_maintenance_mode"() TO "postgres";
GRANT ALL ON FUNCTION "public"."is_app_not_in_maintenance_mode"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_app_not_in_maintenance_mode"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_app_not_in_maintenance_mode"() TO "service_role";
--
-- Name: FUNCTION "make_user_app_admin"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."make_user_app_admin"("user_id" "uuid") TO "service_role";
--
-- Name: FUNCTION "remove_app_admin_privilege_for_user"("user_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."remove_app_admin_privilege_for_user"("user_id" "uuid") TO "service_role";
--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";
--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";
--
-- Name: SEQUENCE "seq_schema_version"; Type: ACL; Schema: graphql; Owner: supabase_admin
--

-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "postgres";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "anon";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "authenticated";
-- GRANT ALL ON SEQUENCE "graphql"."seq_schema_version" TO "service_role";
--
-- Name: TABLE "valid_key"; Type: ACL; Schema: pgsodium; Owner: postgres
--

GRANT ALL ON TABLE "pgsodium"."valid_key" TO "pgsodium_keyiduser";
--
-- Name: TABLE "organization_team_members"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."organization_team_members" TO "anon";
GRANT ALL ON TABLE "public"."organization_team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_team_members" TO "service_role";
--
-- Name: TABLE "organizations"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";
--
-- Name: TABLE "user_profiles"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";
--
-- Name: TABLE "app_admin_view_all_organizations"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."app_admin_view_all_organizations" TO "postgres";
GRANT INSERT,
  REFERENCES,
  DELETE,
  TRIGGER,
  TRUNCATE,
  UPDATE ON TABLE "public"."app_admin_view_all_organizations" TO "anon";
GRANT INSERT,
  REFERENCES,
  DELETE,
  TRIGGER,
  TRUNCATE,
  UPDATE ON TABLE "public"."app_admin_view_all_organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."app_admin_view_all_organizations" TO "service_role";
--
-- Name: TABLE "app_admin_view_all_users"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."app_admin_view_all_users" TO "postgres";
GRANT INSERT,
  REFERENCES,
  DELETE,
  TRIGGER,
  TRUNCATE,
  UPDATE ON TABLE "public"."app_admin_view_all_users" TO "anon";
GRANT INSERT,
  REFERENCES,
  DELETE,
  TRIGGER,
  TRUNCATE,
  UPDATE ON TABLE "public"."app_admin_view_all_users" TO "authenticated";
GRANT ALL ON TABLE "public"."app_admin_view_all_users" TO "service_role";
--
-- Name: TABLE "app_settings"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."app_settings" TO "postgres";
GRANT ALL ON TABLE "public"."app_settings" TO "anon";
GRANT ALL ON TABLE "public"."app_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."app_settings" TO "service_role";
--
-- Name: SEQUENCE "app_settings_id_seq"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "service_role";
--
-- Name: TABLE "customers"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";
--
-- Name: TABLE "organization_team_invitations"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."organization_team_invitations" TO "postgres";
GRANT ALL ON TABLE "public"."organization_team_invitations" TO "anon";
GRANT ALL ON TABLE "public"."organization_team_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."organization_team_invitations" TO "service_role";
--
-- Name: TABLE "organizations_private_info"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."organizations_private_info" TO "postgres";
GRANT ALL ON TABLE "public"."organizations_private_info" TO "anon";
GRANT ALL ON TABLE "public"."organizations_private_info" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations_private_info" TO "service_role";
--
-- Name: TABLE "prices"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";
--
-- Name: TABLE "products"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";
--
-- Name: TABLE "subscriptions"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";
--
-- Name: SEQUENCE "team_members_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."team_members_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."team_members_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."team_members_id_seq" TO "service_role";
--
-- Name: TABLE "user_private_info"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."user_private_info" TO "postgres";
GRANT ALL ON TABLE "public"."user_private_info" TO "anon";
GRANT ALL ON TABLE "public"."user_private_info" TO "authenticated";
GRANT ALL ON TABLE "public"."user_private_info" TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON SEQUENCES TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON FUNCTIONS TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public"
GRANT ALL ON TABLES TO "service_role";
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
--
-- PostgreSQL database dump complete
--

RESET ALL;