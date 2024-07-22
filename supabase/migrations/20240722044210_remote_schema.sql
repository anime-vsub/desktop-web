
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

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."get_last_chap"("user_uid" "text", "season" "text") RETURNS TABLE("created_at" timestamp with time zone, "cur" double precision, "dur" double precision, "name" "text", "chap_id" "text", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT c.created_at, c.cur, c.dur, c.name, c.updated_at, c.chap_id
    FROM public.chaps c
    JOIN public.history h ON c.history_id = h.id
    JOIN public.users u ON h.user_id = u.id
    WHERE u.uuid = user_uid
    AND h.season = season
    order by updated_at desc
    limit 1;
END;
$$;

ALTER FUNCTION "public"."get_last_chap"("user_uid" "text", "season" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_single_progress"("user_uid" "text", "season_id" "text", "p_chap_id" "text") RETURNS TABLE("created_at" timestamp with time zone, "cur" double precision, "dur" double precision, "name" "text", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT c.created_at, c.cur, c.dur, c.name, c.updated_at
    FROM public.chaps c
    JOIN public.history h ON c.history_id = h.id
    JOIN public.users u ON h.user_id = u.id
    WHERE u.uuid = user_uid
    AND h.season = season_id
    AND c.chap_id = p_chap_id
    limit 1;
END;
$$;

ALTER FUNCTION "public"."get_single_progress"("user_uid" "text", "season_id" "text", "p_chap_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_watch_progress"("user_uid" "text", "season_id" "text") RETURNS TABLE("created_at" timestamp with time zone, "cur" double precision, "dur" double precision, "name" "text", "updated_at" timestamp with time zone, "chap_id" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
   SELECT 
    chaps.created_at, 
    chaps.cur, 
    chaps.dur, 
    chaps.name, 
    chaps.updated_at, 
    chaps.chap_id
FROM 
    chaps
JOIN 
    public.history ON chaps.history_id = history.id
JOIN 
    public.users ON history.user_id = users.id
WHERE 
    users.uuid = user_uid
    AND history.season = season_id
ORDER BY 
    history.id;

END;
$$;

ALTER FUNCTION "public"."get_watch_progress"("user_uid" "text", "season_id" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."query_history"("user_uid" "text", "page" integer, "size" integer) RETURNS TABLE("created_at" timestamp with time zone, "season" "text", "name" "text", "poster" "text", "season_name" "text", "watch_updated_at" timestamp with time zone, "watch_name" "text", "watch_id" "text", "watch_cur" double precision, "watch_dur" double precision)
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    query_limit integer;
BEGIN
    -- Set the query limit to the provided limit or maximum of 50
    query_limit := LEAST(size, 50);

    RETURN QUERY
    SELECT h.created_at, h.season, h.name, h.poster, h.season_name,
    c.updated_at as watch_updated_at, c.name as watch_name, c.chap_id as watch_id, c.cur as watch_cur, c.dur as watch_dur
    FROM public.history h
    JOIN public.users u ON h.user_id = u.id
   
    JOIN LATERAL (
        SELECT *
        FROM public.chaps
        WHERE history_id = h.id
        ORDER BY updated_at DESC
        LIMIT 1
    ) c ON true
    WHERE u.uuid = user_uid
    ORDER BY h.created_at DESC
    LIMIT query_limit OFFSET (page - 1) * query_limit;
END;
$$;

ALTER FUNCTION "public"."query_history"("user_uid" "text", "page" integer, "size" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."set_single_progress"("p_name" "text", "p_poster" "text", "season_id" "text", "p_season_name" "text", "user_uid" "text", "e_cur" double precision, "e_dur" double precision, "e_name" "text", "e_chap" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    latest_history record;
    i_user_id int8;
    id_history_rax int8;
    id_chap int8;
BEGIN
    -- Check if user exists
    SELECT id INTO i_user_id
    FROM users
    WHERE uuid = user_uid
    LIMIT 1;

    IF i_user_id IS NULL THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    -- Get the latest history record for the user and season
    SELECT * INTO latest_history
    FROM history
    WHERE user_id = i_user_id AND season = season_id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Insert new history if it does not exist or is not the latest for today
    IF latest_history IS NULL OR latest_history.created_at::DATE <> NOW()::DATE THEN
        INSERT INTO history (created_at, user_id, season, name, poster, season_name, for_to)
        VALUES (NOW(), i_user_id, season_id, p_name, p_poster, p_season_name, NULL);
    END IF;

    -- Get the latest history record ID for the user and season
    SELECT id INTO id_history_rax
    FROM history
    WHERE user_id = i_user_id AND season = season_id AND for_to IS NULL
    ORDER BY created_at DESC
    LIMIT 1;

    IF id_history_rax IS NULL THEN
        RAISE EXCEPTION 'Failed to retrieve or create history record';
    END IF;

    -- Check if the chapter already exists for the history record
    SELECT id INTO id_chap
    FROM chaps
    WHERE history_id = id_history_rax AND chap_id = e_chap
    LIMIT 1;

    -- Insert or update the chapter
    IF id_chap IS NULL THEN
        INSERT INTO chaps (created_at, history_id, cur, dur, name, updated_at, chap_id)
        VALUES (NOW(), id_history_rax, e_cur, e_dur, e_name, NOW(), e_chap);
    ELSE
        UPDATE chaps
        SET cur = e_cur, dur = e_dur, updated_at = NOW()
        WHERE id = id_chap;
    END IF;
END;
$$;

ALTER FUNCTION "public"."set_single_progress"("p_name" "text", "p_poster" "text", "season_id" "text", "p_season_name" "text", "user_uid" "text", "e_cur" double precision, "e_dur" double precision, "e_name" "text", "e_chap" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."chaps" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "history_id" bigint NOT NULL,
    "cur" double precision NOT NULL,
    "dur" double precision NOT NULL,
    "name" "text" NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "chap_id" "text" NOT NULL
);

ALTER TABLE "public"."chaps" OWNER TO "postgres";

ALTER TABLE "public"."chaps" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."chaps_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."history" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" bigint NOT NULL,
    "season" "text" NOT NULL,
    "name" "text" NOT NULL,
    "poster" "text" NOT NULL,
    "season_name" "text" NOT NULL,
    "for_to" bigint
);

ALTER TABLE "public"."history" OWNER TO "postgres";

ALTER TABLE "public"."history" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."history_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."movies" (
    "id" bigint NOT NULL,
    "add_at" timestamp with time zone NOT NULL,
    "name_chap" "text" NOT NULL,
    "name" "text" NOT NULL,
    "chap" "text" NOT NULL,
    "poster" "text" NOT NULL,
    "name_season" "text" NOT NULL,
    "playlist_id" bigint NOT NULL,
    "season" "text" NOT NULL
);

ALTER TABLE "public"."movies" OWNER TO "postgres";

ALTER TABLE "public"."movies" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."movies_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."playlist" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "public" boolean DEFAULT false NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" DEFAULT '""'::"text" NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL
);

ALTER TABLE "public"."playlist" OWNER TO "postgres";

ALTER TABLE "public"."playlist" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."playlist_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "uuid" "text" NOT NULL,
    "name" "text" DEFAULT ''::"text",
    "email" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE "public"."users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."chaps"
    ADD CONSTRAINT "chaps_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."history"
    ADD CONSTRAINT "history_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."movies"
    ADD CONSTRAINT "movies_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."playlist"
    ADD CONSTRAINT "playlist_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_uuid_key" UNIQUE ("uuid");

ALTER TABLE ONLY "public"."chaps"
    ADD CONSTRAINT "chaps_history_id_fkey" FOREIGN KEY ("history_id") REFERENCES "public"."history"("id");

ALTER TABLE ONLY "public"."history"
    ADD CONSTRAINT "history_for_to_fkey" FOREIGN KEY ("for_to") REFERENCES "public"."history"("id");

ALTER TABLE ONLY "public"."history"
    ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."movies"
    ADD CONSTRAINT "movies_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id");

ALTER TABLE ONLY "public"."playlist"
    ADD CONSTRAINT "playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_last_chap"("user_uid" "text", "season" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_last_chap"("user_uid" "text", "season" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_last_chap"("user_uid" "text", "season" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_single_progress"("user_uid" "text", "season_id" "text", "p_chap_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_single_progress"("user_uid" "text", "season_id" "text", "p_chap_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_single_progress"("user_uid" "text", "season_id" "text", "p_chap_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."get_watch_progress"("user_uid" "text", "season_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_watch_progress"("user_uid" "text", "season_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_watch_progress"("user_uid" "text", "season_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."query_history"("user_uid" "text", "page" integer, "size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."query_history"("user_uid" "text", "page" integer, "size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."query_history"("user_uid" "text", "page" integer, "size" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."set_single_progress"("p_name" "text", "p_poster" "text", "season_id" "text", "p_season_name" "text", "user_uid" "text", "e_cur" double precision, "e_dur" double precision, "e_name" "text", "e_chap" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_single_progress"("p_name" "text", "p_poster" "text", "season_id" "text", "p_season_name" "text", "user_uid" "text", "e_cur" double precision, "e_dur" double precision, "e_name" "text", "e_chap" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_single_progress"("p_name" "text", "p_poster" "text", "season_id" "text", "p_season_name" "text", "user_uid" "text", "e_cur" double precision, "e_dur" double precision, "e_name" "text", "e_chap" "text") TO "service_role";

GRANT ALL ON TABLE "public"."chaps" TO "anon";
GRANT ALL ON TABLE "public"."chaps" TO "authenticated";
GRANT ALL ON TABLE "public"."chaps" TO "service_role";

GRANT ALL ON SEQUENCE "public"."chaps_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."chaps_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."chaps_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."history" TO "anon";
GRANT ALL ON TABLE "public"."history" TO "authenticated";
GRANT ALL ON TABLE "public"."history" TO "service_role";

GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."history_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."movies" TO "anon";
GRANT ALL ON TABLE "public"."movies" TO "authenticated";
GRANT ALL ON TABLE "public"."movies" TO "service_role";

GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."movies_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."playlist" TO "anon";
GRANT ALL ON TABLE "public"."playlist" TO "authenticated";
GRANT ALL ON TABLE "public"."playlist" TO "service_role";

GRANT ALL ON SEQUENCE "public"."playlist_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."playlist_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."playlist_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
