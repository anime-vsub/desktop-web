set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_movie_playlist(user_uid text, playlist_id bigint, p_chap text, p_name text, p_name_chap text, p_name_season text, p_poster text, p_season text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, public boolean, name text, description text, updated_at timestamp with time zone, movies_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  p_playlist_id int8;
BEGIN

    select playlist.id into p_playlist_id
    from playlist
    where user_id = (select users.id from users where uuid = user_uid limit 1)
    and playlist.id = playlist_id
    limit 1;
    
    if p_playlist_id is null then
      raise EXCEPTION 'Playlist not exists';
    else
      if not exists(select * from movies where movies.playlist_id = p_playlist_id and season = p_season limit 1) then
        insert into movies (add_at, chap, name, name_chap, name_season, playlist_id, poster, season)
        values (now(), p_chap, p_name, p_name_chap, p_name_season, p_playlist_id, p_poster, p_season);
      end if;
    end if;

    
    return query SELECT p.id, p.created_at, p.public, p.name, p.description, p.updated_at, 
           (SELECT COUNT(*) FROM public.movies m WHERE m.playlist_id = p.id) as movies_count
    FROM public.playlist p
    JOIN public.users u ON p.user_id = u.id
    WHERE u.uuid = user_uid
    AND p.id = p_playlist_id
    limit 1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_movie_playlist(user_uid text, playlist_name text, p_chap text, p_name text, p_name_chap text, p_name_season text, p_poster text, p_season text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  p_playlist_id int8;
BEGIN
    select id into p_playlist_id
    from playlist
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid limit 1)
    AND name = playlist_name
    limit 1;

    if p_playlist_id is not null then
      raise EXCEPTION 'Playlist not exists';
    else
      insert into movies (add_at, chap, name, name_chap, name_season, playlist_id, poster, season)
      values (now(), p_chap, p_name, p_name_chap, p_name_season, p_playlist_id, p_poster, p_season);
    end if;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_playlist(user_uid text, playlist_name text, is_public boolean)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, public boolean, name text, description text, updated_at timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
    DECLARE new_playlist_id bigint;
    BEGIN
        INSERT INTO public.playlist (created_at, public, name, user_id)
        VALUES (now(), is_public, playlist_name, (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1))
        RETURNING id, created_at, public, name, null::text, now(), user_id INTO new_playlist_id;
        
        RETURN QUERY SELECT p.id, p.created_at, p.public, p.name, p.description, p.updated_at
        FROM public.playlist p
        WHERE p.id = new_playlist_id;
    END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_movie_playlist(user_uid text, playlist_id bigint, p_season text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, public boolean, name text, description text, updated_at timestamp with time zone, movies_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  p_playlist_id int8;
BEGIN
    p_playlist_id := playlist_id;
    
    DELETE FROM movies
    WHERE movies.playlist_id IN (SELECT playlist.id FROM playlist WHERE user_id = (SELECT users.id FROM users WHERE uuid = user_uid) and playlist.id = p_playlist_id)
    AND season = p_season;

    
    return query SELECT p.id, p.created_at, p.public, p.name, p.description, p.updated_at, 
           (SELECT COUNT(*) FROM public.movies m WHERE m.playlist_id = p.id) as movies_count
    FROM public.playlist p
    JOIN public.users u ON p.user_id = u.id
    WHERE u.uuid = user_uid
    AND p.id = p_playlist_id
    limit 1;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_movie_playlist(user_uid text, q_name text, p_season text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM public.movies
    WHERE playlist_id IN (SELECT id FROM public.playlist WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid) and name = q_name)
    AND season = p_season;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_playlist(user_uid text, playlist_id bigint)
 RETURNS void
 LANGUAGE sql
AS $function$
    DELETE FROM public.playlist
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND id = playlist_id;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_playlist(user_uid text, playlist_name text)
 RETURNS void
 LANGUAGE sql
AS $function$
    DELETE FROM public.playlist
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND name = playlist_name;
$function$
;

CREATE OR REPLACE FUNCTION public.get_list_playlist(user_uid text)
 RETURNS TABLE(id bigint, created_at timestamp with time zone, public boolean, name text, description text, updated_at timestamp with time zone, movies_count bigint)
 LANGUAGE sql
AS $function$
    SELECT p.id, p.created_at, p.public, p.name, p.description, p.updated_at, 
           (SELECT COUNT(*) FROM public.movies m WHERE m.playlist_id = p.id) as movies_count
    FROM public.playlist p
    JOIN public.users u ON p.user_id = u.id
    WHERE u.uuid = user_uid
    ORDER BY p.created_at DESC;
$function$
;

CREATE OR REPLACE FUNCTION public.get_movies_playlist(user_uid text, playlist_id bigint, sorter text, page integer, page_size integer)
 RETURNS TABLE(add_at timestamp with time zone, name_chap text, name text, chap text, poster text, name_season text, season text)
 LANGUAGE plpgsql
AS $function$
declare
  i_playlist_id int8;
begin
    i_playlist_id := playlist_id;

    if (sorter = 'desc') then
      return query SELECT m.add_at, m.name_chap, m.name, m.chap, m.poster, m.name_season, m.season
      FROM public.movies m
      JOIN public.playlist p ON m.playlist_id = p.id
      JOIN public.users u ON p.user_id = u.id
      WHERE u.uuid = user_uid
      AND p.id = i_playlist_id
      ORDER BY m.add_at DESC
      LIMIT page_size OFFSET (page - 1) * page_size;
    else
      return query SELECT m.add_at, m.name_chap, m.name, m.chap, m.poster, m.name_season, m.season
      FROM public.movies m
      JOIN public.playlist p ON m.playlist_id = p.id
      JOIN public.users u ON p.user_id = u.id
      WHERE u.uuid = user_uid
      AND p.id = i_playlist_id
      ORDER BY m.add_at ASC
      LIMIT page_size OFFSET (page - 1) * page_size;
    end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_poster_playlist(user_uid text, playlist_id bigint)
 RETURNS TABLE(poster text)
 LANGUAGE plpgsql
AS $function$
declare
  p_playlist_id int8;
begin
    p_playlist_id := playlist_id;

    return query SELECT m.poster
    FROM public.movies m
    JOIN public.playlist p ON m.playlist_id = p.id
    JOIN public.users u ON p.user_id = u.id
    WHERE u.uuid = user_uid
    AND p.id = p_playlist_id
    ORDER BY m.add_at
    LIMIT 1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_poster_playlist(user_uid text, playlist_name text)
 RETURNS TABLE(poster text)
 LANGUAGE sql
AS $function$
    SELECT m.poster
    FROM public.movies m
    JOIN public.playlist p ON m.playlist_id = p.id
    JOIN public.users u ON p.user_id = u.id
    WHERE u.uuid = user_uid
    AND p.name = playlist_name
    ORDER BY m.add_at
    LIMIT 1;
$function$
;

CREATE OR REPLACE FUNCTION public.has_movie_playlist(user_uid text, playlist_id bigint, season_id text)
 RETURNS TABLE(has_movie boolean)
 LANGUAGE plpgsql
AS $function$
DECLARE
    i_playlist_id int8;
begin 
    i_playlist_id := playlist_id;
    return query SELECT EXISTS (
        SELECT 1
        FROM public.movies m
        JOIN public.playlist p ON m.playlist_id = p.id
        JOIN public.users u ON p.user_id = u.id
        WHERE u.uuid = user_uid
        AND p.id = i_playlist_id
        AND m.season = season_id
    ) AS has_movie;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.has_movie_playlist(user_uid text, playlist_name text, season_id text)
 RETURNS TABLE(has_movie boolean)
 LANGUAGE plpgsql
AS $function$
begin 
    return query SELECT EXISTS (
        SELECT 1
        FROM public.movies m
        JOIN public.playlist p ON m.playlist_id = p.id
        JOIN public.users u ON p.user_id = u.id
        WHERE u.uuid = user_uid
        AND p.name = playlist_name
        AND m.season = season_id
    ) AS has_movie;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.has_movie_playlists(user_uid text, playlist_ids bigint[], season_id text)
 RETURNS TABLE(playlist_id bigint, has_movie boolean)
 LANGUAGE plpgsql
AS $function$
DECLARE
    i_playlist_id int8;
BEGIN 
    FOREACH i_playlist_id IN ARRAY playlist_ids
    LOOP
        RETURN QUERY SELECT i_playlist_id, EXISTS (
            SELECT 1
            FROM public.movies m
            JOIN public.playlist p ON m.playlist_id = p.id
            JOIN public.users u ON p.user_id = u.id
            WHERE u.uuid = user_uid
            AND p.id = i_playlist_id
            AND m.season = season_id
        ) AS has_movie;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.rename_playlist(user_uid text, old_name text, new_name text)
 RETURNS void
 LANGUAGE sql
AS $function$
    UPDATE public.playlist
    SET name = new_name
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND name = old_name;
$function$
;

CREATE OR REPLACE FUNCTION public.set_description_playlist(user_uid text, playlist_id bigint, playlist_description text)
 RETURNS void
 LANGUAGE sql
AS $function$
    UPDATE public.playlist
    SET description = playlist_description
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND id = playlist_id;
$function$
;

CREATE OR REPLACE FUNCTION public.set_description_playlist(user_uid text, playlist_name text, playlist_description text)
 RETURNS void
 LANGUAGE sql
AS $function$
    UPDATE public.playlist
    SET description = playlist_description
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND name = playlist_name;
$function$
;

CREATE OR REPLACE FUNCTION public.set_public_playlist(user_uid text, playlist_id bigint, is_public boolean)
 RETURNS void
 LANGUAGE sql
AS $function$
    UPDATE public.playlist
    SET public = is_public
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND id = playlist_id;
$function$
;

CREATE OR REPLACE FUNCTION public.set_public_playlist(user_uid text, playlist_name text, is_public boolean)
 RETURNS void
 LANGUAGE sql
AS $function$
    UPDATE public.playlist
    SET public = is_public
    WHERE user_id = (SELECT id FROM public.users WHERE uuid = user_uid LIMIT 1)
    AND name = playlist_name;
$function$
;


