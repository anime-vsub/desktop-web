drop function if exists "public"."upsert_user"(uuid text, email text, name text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.upsert_user(p_uuid text, p_email text DEFAULT NULL::text, p_name text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    
    if not exists(select * from users where users.uuid = p_uuid limit 1) then
      INSERT INTO users (uuid, email, name, created_at)
      VALUES (p_uuid, p_email, p_name, now());
    else
      update users set email = p_email, name = p_name where uuid = p_uuid;
    end if;
END;
$function$
;


