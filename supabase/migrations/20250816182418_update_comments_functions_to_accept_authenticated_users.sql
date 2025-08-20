drop function if exists "public"."update_comment"(p_comment_id bigint, p_password text, p_content text);

drop function if exists "public"."verify_comment"(p_comment_id bigint, p_password text);

alter table "public"."comments" add column "author_id" uuid;

alter table "public"."comments" alter column "password_hash" drop not null;

alter table "public"."comments" add constraint "comments_author_id_fkey" FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_author_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_comment_ownership(p_comment_id bigint, p_password text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_hash text;
  v_uid uuid;
BEGIN
  IF p_password IS NOT NULL THEN
    SELECT password_hash INTO v_hash FROM comments WHERE id = p_comment_id;
    IF v_hash IS NULL OR v_hash <> crypt(p_password, v_hash) THEN
      RETURN false;
    END IF;
  ELSE
    SELECT author_id INTO v_uid FROM comments WHERE id = p_comment_id;
    IF v_uid IS NULL OR v_uid <> auth.uid() THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_comment(p_comment_id bigint, p_content text, p_password text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  IF NOT check_comment_ownership(p_comment_id, p_password) THEN
    RETURN false;
  END IF;

  UPDATE comments SET content = p_content WHERE id = p_comment_id;

  RETURN true;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_comment(p_record_id bigint, p_author_name text, p_content text, p_password text DEFAULT NULL::text)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_id bigint;
    v_user_id uuid;
    v_hash text;
BEGIN
    SELECT auth.uid() INTO v_user_id;

    IF v_user_id IS NOT NULL THEN
        INSERT INTO comments(record_id, author_name, content, author_id)
        VALUES (p_record_id, p_author_name, p_content, v_user_id)
        RETURNING id INTO v_id;
    ELSE
        v_hash := crypt(p_password, gen_salt('bf'));

        INSERT INTO comments(record_id, author_name, content, password_hash)
        VALUES (p_record_id, p_author_name, p_content, v_hash)
        RETURNING id INTO v_id;
    END IF;

    RETURN v_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.delete_comment(p_comment_id bigint, p_password text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  IF NOT check_comment_ownership(p_comment_id, p_password) THEN
    RETURN false;
  END IF;

  DELETE FROM comments WHERE id = p_comment_id;

  RETURN true;
END;$function$
;


