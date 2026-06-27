-- Add explicit grants to all public schema objects
-- Reference: https://github.com/orgs/supabase/discussions/45329
-- RLS alone is not sufficient; explicit GRANTs are required for PostgREST access.

-- Schema usage
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";

-- Functions
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";

GRANT ALL ON FUNCTION "public"."set_private_item_owner_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_private_item_owner_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_private_item_owner_id"() TO "service_role";

-- Tables
GRANT ALL ON TABLE "public"."private_items" TO "anon";
GRANT ALL ON TABLE "public"."private_items" TO "authenticated";
GRANT ALL ON TABLE "public"."private_items" TO "service_role";

GRANT ALL ON TABLE "public"."content_blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."content_blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."content_blog_posts" TO "service_role";

GRANT ALL ON TABLE "public"."content_blog_post_comments" TO "anon";
GRANT ALL ON TABLE "public"."content_blog_post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."content_blog_post_comments" TO "service_role";

-- Default privileges for future objects
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
