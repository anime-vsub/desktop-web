set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.upsert_user(uuid text, email text DEFAULT NULL::text, name text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.users (uuid, email, name, created_at)
    VALUES (uuid, email, name, now())
    ON CONFLICT (uuid) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = now();
END;
$function$
;


