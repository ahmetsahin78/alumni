-- =============================================================================
-- Migration: job_postings domain rules (ddd.md -> 7. job_postings / Kurallar)
--  * title       : NOT NULL, en fazla 120 karakter  -> VARCHAR(120)
--  * company     : NOT NULL (değişmedi)
--  * location    : opsiyonel (şehir)                -> NULL olabilir
--  * description : opsiyonel                         -> NULL olabilir
-- =============================================================================

ALTER TABLE "job_postings" ALTER COLUMN "title" SET DATA TYPE VARCHAR(120);
ALTER TABLE "job_postings" ALTER COLUMN "location" DROP NOT NULL;
ALTER TABLE "job_postings" ALTER COLUMN "description" DROP NOT NULL;
