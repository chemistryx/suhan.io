drop policy "Allow read public or own drafts" on "public"."records";

create policy "Allow delete for own record only"
on "public"."record_tags"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM records
  WHERE ((records.id = record_tags.record_id) AND (records.author_id = auth.uid())))));


create policy "Allow select public or own drafts"
on "public"."records"
as permissive
for select
to public
using (((draft = false) OR (author_id = ( SELECT auth.uid() AS uid))));



