drop policy "Allow select public or own drafts" on "public"."records";

alter table "public"."records" drop column "draft";

alter table "public"."records" add column "published" boolean not null default false;

create policy "Allow select public or own records"
on "public"."records"
as permissive
for select
to public
using (((published = true) OR (author_id = ( SELECT auth.uid() AS uid))));



