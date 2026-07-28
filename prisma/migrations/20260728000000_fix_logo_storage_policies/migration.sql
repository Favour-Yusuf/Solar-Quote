-- Company logo uploads were failing for every installer with
-- "new row violates row-level security policy".
--
-- Root cause: the `logos` policies created in the init migration cover
-- INSERT/UPDATE/DELETE but not SELECT. Supabase Storage implements an
-- upsert (`x-upsert: true`) as `INSERT ... ON CONFLICT DO UPDATE`, and
-- Postgres requires a SELECT policy on the target table before it will
-- evaluate an ON CONFLICT clause — without one, the write is rejected
-- before the INSERT policy is ever reached.
--
-- Reading objects back is also needed now that a new upload cleans up the
-- installer's previous logo file (list + remove both go through SELECT).
--
-- The bucket is public, so this policy does not widen customer-facing
-- access: it only lets an authenticated installer see the rows under their
-- own `logos/<uid>/` folder, matching the other three policies.
CREATE POLICY "logos: owners can read their own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'logos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
