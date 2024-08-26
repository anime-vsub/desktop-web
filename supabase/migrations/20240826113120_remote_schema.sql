drop function if exists "public"."delete_notify"(user_uid text, p_season text);

drop function if exists "public"."delete_notify"(user_uid text, p_season text, p_chapid text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_notify(user_uid text, p_season text)
 RETURNS TABLE(notify_count integer, notify_chap_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    i_user_id integer;
    i_notify int8;
BEGIN
    -- Check if user exists and get user id
    SELECT u.id INTO i_user_id
    FROM users u
    WHERE u.uuid = user_uid
    LIMIT 1;

    IF i_user_id IS NULL THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    select id into i_notify
    from notify
    where season = p_season
    and user_id = i_user_id
    limit 1;

    if i_notify is null then
      raise exception 'Season does not exist';
    end if;

    delete from notify_chap
    where notify_id = i_notify;

    delete from notify where id = i_notify;

    return query select * from get_count_notify(user_uid);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_notify(user_uid text, p_season text, p_chapid text)
 RETURNS TABLE(notify_count integer, notify_chap_count integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    i_user_id integer;
    i_notify int8;
BEGIN
    -- Check if user exists and get user id
    SELECT u.id INTO i_user_id
    FROM users u
    WHERE u.uuid = user_uid
    LIMIT 1;

    IF i_user_id IS NULL THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;

    select id into i_notify
    from notify
    where season = p_season
    and user_id = i_user_id
    limit 1;

    if i_notify is null then
      raise exception 'Season does not exist';
    end if;

    delete from notify_chap
    where notify_id = i_notify
    and chap_id = p_chapId;

    if not exists (
      select 1 from notify_chap where notify_id = i_notify limit 1
    ) then
      delete from notify where id = i_notify;
    end if;

    return query select * from get_count_notify(user_uid);
END;
$function$
;


