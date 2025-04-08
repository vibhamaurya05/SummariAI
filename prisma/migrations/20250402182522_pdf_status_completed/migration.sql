/*
  Warnings:

  - The values [COMPLETED] on the enum `PdfStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PdfStatus_new" AS ENUM ('PENDING', 'COPLETED', 'FAILED');
ALTER TABLE "pdf_summary" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "pdf_summary" ALTER COLUMN "status" TYPE "PdfStatus_new" USING ("status"::text::"PdfStatus_new");
ALTER TYPE "PdfStatus" RENAME TO "PdfStatus_old";
ALTER TYPE "PdfStatus_new" RENAME TO "PdfStatus";
DROP TYPE "PdfStatus_old";
ALTER TABLE "pdf_summary" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "pdf_summary" ALTER COLUMN "status" SET DEFAULT 'PENDING';
