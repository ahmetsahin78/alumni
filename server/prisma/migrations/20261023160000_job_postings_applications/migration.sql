-- =============================================================================
-- Migration: job_postings + applications
--  * job_postings.id: TEXT (uuid) -> SERIAL (INT auto-increment), ddd.md ile uyumlu
--  * yeni applications tablosu: (jobId, userId) UNIQUE çifti
--  * delete rule: users -> job_postings -> applications zinciri ON DELETE CASCADE
-- =============================================================================

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');

-- AlterTable: job_postings.id TEXT -> SERIAL (mevcut satırlar 1'den numaralanır)
ALTER TABLE "job_postings" DROP CONSTRAINT "job_postings_pkey",
DROP COLUMN "id",
ADD COLUMN "id" SERIAL NOT NULL,
ADD CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "coverLetter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_postings_authorId_idx" ON "job_postings"("authorId");

-- CreateIndex
CREATE INDEX "applications_userId_idx" ON "applications"("userId");

-- CreateIndex (unique pair: bir kullanıcı bir ilana bir kez başvurur)
CREATE UNIQUE INDEX "applications_jobId_userId_key" ON "applications"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
