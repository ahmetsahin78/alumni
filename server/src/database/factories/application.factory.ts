/**
 * ============================================================================
 * Application Factory
 * ============================================================================
 * applications tablosu için başvuru verisi üretir.
 * (jobId, userId) çifti benzersiz olmalıdır; buildForPairs tekrar edenleri eler.
 * ============================================================================
 */

import { ApplicationStatus, Prisma } from "@prisma/client";

const COVER_LETTERS = [
  "Merhaba, ilanınızla ilgileniyorum. Özgeçmişimi ekte bulabilirsiniz.",
  "Üniversitede bu alanda projeler geliştirdim, ekibinize katkı sağlamak isterim.",
  "Staj deneyimimi bu pozisyonda ilerletmek istiyorum.",
];

export class ApplicationFactory {
  public static build(
    jobId: number,
    userId: string,
    overrides: Partial<Prisma.ApplicationUncheckedCreateInput> = {}
  ): Prisma.ApplicationUncheckedCreateInput {
    return {
      jobId,
      userId,
      status: ApplicationStatus.PENDING,
      coverLetter: COVER_LETTERS[Math.floor(Math.random() * COVER_LETTERS.length)],
      ...overrides,
    };
  }

  /** Aynı (jobId, userId) çiftini iki kez üretmez -> UNIQUE kısıtına takılmaz */
  public static buildForPairs(pairs: Array<[number, string]>): Prisma.ApplicationUncheckedCreateInput[] {
    const seen = new Set<string>();
    const result: Prisma.ApplicationUncheckedCreateInput[] = [];
    for (const [jobId, userId] of pairs) {
      const key = `${jobId}:${userId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(this.build(jobId, userId));
    }
    return result;
  }
}
