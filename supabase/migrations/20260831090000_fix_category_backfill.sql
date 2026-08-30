-- The backfill in 20260830140000 matched on full titles and wrote an en dash
-- where the records use a hyphen, so the five titles carrying one were left
-- uncategorised. Match on the part before the dash instead, which is
-- distinctive on its own and cannot be spelled wrong.

update "public"."records" set "category_id" = (select "id" from "public"."categories" where "slug" = 'backend')
where "title" like '웹으로 만든 4컷 포토부스 (2)%'
   or "title" like '웹으로 만든 4컷 포토부스 (3)%'
   or "title" like '모두에게 공평한 모임 장소 추천하기 (2)%';

update "public"."records" set "category_id" = (select "id" from "public"."categories" where "slug" = 'frontend')
where "title" like '웹으로 만든 4컷 포토부스 (1)%';

update "public"."records" set "category_id" = (select "id" from "public"."categories" where "slug" = 'infra')
where "title" like '모두에게 공평한 모임 장소 추천하기 (1)%';
