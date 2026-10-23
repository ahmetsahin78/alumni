/**
 * ============================================================================
 * Database Seeder (Prisma ORM)
 * ============================================================================
 * Alumni Tracking System veritabanını test ve geliştirme ortamları için
 * gerçekçi verilerle (Seed) doldurur.
 * ============================================================================
 */

import { PrismaClient, Role, JobType, RSVPStatus, MentorshipStatus, AnnouncementCategory, AnnouncementPriority } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UserFactory } from "../src/database/factories/user.factory";
import { AnnouncementFactory } from "../src/database/factories/announcement.factory";
import { AlumniFactory } from "../src/database/factories/alumni.factory";
import { JobFactory } from "../src/database/factories/job.factory";
import { ApplicationFactory } from "../src/database/factories/application.factory";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Clean existing records in correct foreign key order
  //    Önce çocuk tablolar (FK tutanlar), en son users. Ters sırada silmek
  //    FK kısıtı nedeniyle hata verir (ya da CASCADE ile istemeden siler).
  console.log("🧹 Cleaning old records...");
  await prisma.application.deleteMany();   // -> job_postings, users
  await prisma.eventRSVP.deleteMany();     // -> events, users
  await prisma.event.deleteMany();         // -> users
  await prisma.jobPosting.deleteMany();    // -> users
  await prisma.mentorshipRequest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.academicHistory.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.alumnus.deleteMany();
  await prisma.user.deleteMany();

  // 1b. Reset auto-increment id counters so seeded ids start from 1 again
  console.log("🔢 Resetting id counters...");
  //    (users tablosu UUID kullandığı için sayacı yok)
  for (const table of ["applications", "job_postings", "announcements", "alumni_records"]) {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1`);
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 2. Create Core Admin & Faculty Users
  console.log("👤 Creating Admin & Faculty users...");
  const admin = await prisma.user.create({
    data: {
      email: "admin@istanbul.edu.tr",
      name: "Sistem Yöneticisi",
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
      department: "Rektörlük",
      company: "İstanbul Üniversitesi",
      profile: {
        create: {
          firstName: "Sistem",
          lastName: "Yöneticisi",
          headline: "Mezun Takip Sistemi Koordinatörü",
          bio: "İstanbul Üniversitesi Mezunlar ve Kariyer İlişkileri Koordinasyon Ofisi",
          location: "İstanbul, Türkiye",
        },
      },
    },
  });

  const faculty = await prisma.user.create({
    data: {
      email: "emre.akadal@istanbul.edu.tr",
      name: "Prof. Dr. Emre Akadal",
      passwordHash,
      role: Role.FACULTY,
      graduationYear: 2008,
      department: "Yönetim Bilişim Sistemleri",
      company: "İstanbul Üniversitesi",
      isVerified: true,
      profile: {
        create: {
          firstName: "Emre",
          lastName: "Akadal",
          headline: "Öğretim Üyesi @ İstanbul Üniversitesi",
          bio: "Web Programlama ve Veritabanı Sistemleri",
          location: "İstanbul, Türkiye",
          isMentor: true,
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "İktisat Fakültesi",
          department: "Yönetim Bilişim Sistemleri",
          degree: "Doktora",
          startYear: 2004,
          graduationYear: 2008,
        },
      },
    },
  });

  // 3. Create Key Alumni Users (Matches Week 03 & 04 in-memory data)
  console.log("🎓 Creating Core Alumni users...");
  const alumni1 = await prisma.user.create({
    data: {
      email: "elif.kaya@istanbul.edu.tr",
      name: "Elif Kaya",
      passwordHash,
      role: Role.ALUMNI,
      graduationYear: 2024,
      department: "Bilgisayar Mühendisliği",
      company: "Google",
      isVerified: true,
      profile: {
        create: {
          firstName: "Elif",
          lastName: "Kaya",
          headline: "Software Engineer @ Google",
          bio: "İ.Ü. Bilgisayar Mühendisliği 2024 mezunuyum. Cloud computing, Distributed Systems konularında çalışıyorum.",
          location: "Zürih, İsviçre",
          linkedinUrl: "https://linkedin.com/in/elif-kaya-demo",
          githubUrl: "https://github.com/elif-kaya-demo",
          isMentor: true,
          mentorshipTopics: "Kariyer Tavsiyesi, Cloud Architecture, Global İş Başvuruları",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "Mühendislik Fakültesi",
          department: "Bilgisayar Mühendisliği",
          degree: "Lisans",
          startYear: 2020,
          graduationYear: 2024,
        },
      },
      workExperiences: {
        create: {
          company: "Google",
          position: "Software Engineer",
          industry: "Teknoloji / Yazılım",
          location: "Zürih / Hibrit",
          startDate: new Date("2024-07-01"),
          isCurrent: true,
          description: "Google Cloud Platform altyapı servisleri geliştirme.",
        },
      },
    },
  });

  const alumni2 = await prisma.user.create({
    data: {
      email: "mert.aydin@istanbul.edu.tr",
      name: "Mert Aydın",
      passwordHash,
      role: Role.ALUMNI,
      graduationYear: 2021,
      department: "Endüstri Mühendisliği",
      company: "Microsoft",
      isVerified: true,
      profile: {
        create: {
          firstName: "Mert",
          lastName: "Aydın",
          headline: "Product Manager @ Microsoft",
          bio: "2021 Endüstri Mühendisliği mezunu. Ürün yönetimi ve veri odaklı büyüme.",
          location: "İstanbul, Türkiye",
          linkedinUrl: "https://linkedin.com/in/mert-aydin-demo",
          isMentor: true,
          mentorshipTopics: "Product Management, Agile, Tech Career",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "Mühendislik Fakültesi",
          department: "Endüstri Mühendisliği",
          degree: "Lisans",
          startYear: 2017,
          graduationYear: 2021,
        },
      },
      workExperiences: {
        create: {
          company: "Microsoft",
          position: "Product Manager",
          industry: "Teknoloji",
          location: "İstanbul",
          startDate: new Date("2021-09-01"),
          isCurrent: true,
          description: "Enterprise çözümler için ürün stratejisi ve roadmap yönetimi.",
        },
      },
    },
  });

  const alumni3 = await prisma.user.create({
    data: {
      email: "zeynep.arslan@istanbul.edu.tr",
      name: "Zeynep Arslan",
      passwordHash,
      role: Role.ALUMNI,
      graduationYear: 2019,
      department: "İktisat",
      company: "FinScale",
      isVerified: true,
      profile: {
        create: {
          firstName: "Zeynep",
          lastName: "Arslan",
          headline: "Lead Analyst @ FinScale",
          bio: "İktisat 2019 mezunu. FinTech ve finansal analiz uzmanı.",
          location: "Londra, Birleşik Krallık",
          linkedinUrl: "https://linkedin.com/in/zeynep-arslan-demo",
          isMentor: true,
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "İktisat Fakültesi",
          department: "İktisat",
          degree: "Lisans",
          startYear: 2015,
          graduationYear: 2019,
        },
      },
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "can.ozturk@istanbul.edu.tr",
      name: "Can Öztürk",
      passwordHash,
      role: Role.STUDENT,
      graduationYear: 2025,
      department: "Yazılım Mühendisliği",
      company: "Trendyol Stajyer",
      isVerified: true,
      profile: {
        create: {
          firstName: "Can",
          lastName: "Öztürk",
          headline: "3. Sınıf Yazılım Mühendisliği Öğrencisi",
          bio: "Web geliştirme ve açık kaynak projelere ilgi duyuyorum.",
          location: "İstanbul, Türkiye",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "Mühendislik Fakültesi",
          department: "Yazılım Mühendisliği",
          degree: "Lisans",
          startYear: 2021,
          graduationYear: 2025,
        },
      },
    },
  });

  // 4. Generate Additional Users with UserFactory
  console.log("🏭 Generating realistic users via UserFactory...");
  const factoryUsers = UserFactory.buildMany(6);
  const factoryUserIds: string[] = [];
  for (const fUser of factoryUsers) {
    const created = await prisma.user.create({
      data: {
        name: fUser.name,
        email: fUser.email,
        role: fUser.role,
        graduationYear: fUser.graduationYear,
        department: fUser.department,
        company: fUser.company,
        isVerified: fUser.isVerified,
        avatarUrl: fUser.avatarUrl,
        passwordHash,
      },
    });
    factoryUserIds.push(created.id);
  }

  // 5. Seed Skills
  console.log("💡 Seeding Skills catalog...");
  const skillNames = ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker", "Product Management", "Python", "AWS", "Prisma ORM", "Microservices"];
  for (const name of skillNames) {
    const skill = await prisma.skill.create({ data: { name } });
    if (["Node.js", "TypeScript", "PostgreSQL", "Docker"].includes(name)) {
      await prisma.userSkill.create({
        data: { userId: alumni1.id, skillId: skill.id },
      });
    }
  }

  // 6. Seed Announcements via AnnouncementFactory
  console.log("📢 Seeding Announcements...");
  const sampleAnnouncements = [
    {
      title: "2026 Mezunlar Buluşması ve Kariyer Günü",
      content: "Tüm mezunlarımız ve son sınıf öğrencilerimiz için geleneksel Beyazıt Kampüsü Mezunlar Buluşması 15 Mayıs'ta gerçekleşecektir. Kayıt yaptırmayı unutmayınız.",
      author: "Mezunlar Ofisi Koordinatörlüğü",
      category: AnnouncementCategory.EVENT,
      priority: AnnouncementPriority.HIGH,
      authorUserId: admin.id,
    },
    {
      title: "Google & Microsoft Mentorluk Programı Başvuruları Başladı",
      content: "Sektörde çalışan deneyimli mezunlarımız ile öğrencilerimizi buluşturan 6 aylık mentorluk programı başvuruları açılmıştır.",
      author: "Kariyer Geliştirme Merkezi",
      category: AnnouncementCategory.CAREER,
      priority: AnnouncementPriority.HIGH,
      authorUserId: admin.id,
    },
    {
      title: "Web Programlama Dersi Veritabanı Kalıcılığı Proje Teslimleri",
      content: "Docker Compose, PostgreSQL kalıcı hacmi ve Prisma ORM migration adımları eksiksiz tamamlanmalıdır.",
      author: "Prof. Dr. Emre Akadal",
      category: AnnouncementCategory.ACADEMIC,
      priority: AnnouncementPriority.MEDIUM,
      authorUserId: faculty.id,
    },
    {
      title: "Kütüphane Veritabanı ve Uzaktan Erişim Bakım Duyurusu",
      content: "Hafta sonu kütüphane dijital portalında planlı bakım çalışması yapılacaktır. Bilgilerinize sunulur.",
      author: "Bilgi İşlem Daire Başkanlığı",
      category: AnnouncementCategory.GENERAL,
      priority: AnnouncementPriority.LOW,
      authorUserId: admin.id,
    },
  ];

  for (const ann of sampleAnnouncements) {
    await prisma.announcement.create({ data: ann });
  }

  // 7. Seed Alumni Records Table (Week 03 table compatibility)
  console.log("📜 Seeding Alumni Records (Week 03 table)...");
  const seedAlumni = AlumniFactory.buildMany(4);
  for (const item of seedAlumni) {
    await prisma.alumnus.create({ data: item });
  }

  // 8. Seed Job Postings (id = 1 her seed'de aynı ilan)
  console.log("💼 Seeding Job Postings...");
  const backendJob = await prisma.jobPosting.create({
    data: {
      authorId: alumni1.id,
      title: "Junior Backend Developer",
      company: "Google Cloud Partner / TechCorp",
      location: "İstanbul (Hibrit)",
      type: JobType.FULL_TIME,
      industry: "Teknoloji",
      description: "Ekibimize katılacak hevesli Junior Backend Geliştirici arıyoruz. Node.js ve SQL deneyimi olan mezunlar önceliklidir.",
      requirements: "Node.js/TypeScript temeli, REST API kavramları, PostgreSQL ve Git bilgisi.",
      applicationUrl: "https://careers.google.com",
      salaryRange: "45.000 - 65.000 TL",
    },
  });

  const factoryJobs = [
    ...JobFactory.buildMany(2, alumni1.id),
    ...JobFactory.buildMany(2, alumni2.id),
  ];
  const jobIds: number[] = [backendJob.id];
  for (const job of factoryJobs) {
    const created = await prisma.jobPosting.create({ data: job });
    jobIds.push(created.id);
  }

  // 8b. Seed Applications (her (jobId, userId) çifti tek)
  console.log("📨 Seeding Applications...");
  const applicants = [student.id, ...factoryUserIds.slice(0, 3)];
  const pairs: Array<[number, string]> = [
    [backendJob.id, student.id],
    [backendJob.id, alumni3.id],
    ...applicants.map((userId, i) => [jobIds[(i + 1) % jobIds.length], userId] as [number, string]),
  ];
  for (const app of ApplicationFactory.buildForPairs(pairs)) {
    await prisma.application.create({ data: app });
  }

  // 9. Seed Events & RSVP
  console.log("📅 Seeding Events & RSVPs...");
  const reunionEvent = await prisma.event.create({
    data: {
      organizerId: admin.id,
      title: "2026 Geleneksel Mezunlar Buluşması ve Kariyer Günü",
      description: "İstanbul Üniversitesi tarihi Beyazıt Kampüsü'nde tüm mezunlarımız ve öğrencilerimizle bir araya geliyoruz.",
      location: "Beyazıt Kampüsü Rektörlük Bahçesi, İstanbul",
      eventDate: new Date("2026-10-15T14:00:00Z"),
      isOnline: false,
      maxAttendees: 500,
    },
  });

  await prisma.eventRSVP.create({
    data: {
      eventId: reunionEvent.id,
      userId: alumni1.id,
      status: RSVPStatus.ATTENDING,
    },
  });

  // 10. Seed Mentorship Request
  console.log("🤝 Seeding Mentorship Request...");
  await prisma.mentorshipRequest.create({
    data: {
      mentorId: alumni1.id,
      menteeId: student.id,
      status: MentorshipStatus.ACCEPTED,
      message: "Merhaba Elif Hanım, ben 3. sınıf öğrencisiyim. Bulut bilişim ve backend mimarileri hakkında tavsiyelerinizi rica ediyorum.",
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      notes: "Haftalık periyodik görüşme ayarlandı.",
    },
  });

  console.log("\n=======================================================");
  console.log("✅ Seed completed successfully!");
  console.log("   - Users created:", await prisma.user.count());
  console.log("   - Announcements created:", await prisma.announcement.count());
  console.log("   - Alumni records created:", await prisma.alumnus.count());
  console.log("   - Job postings created:", await prisma.jobPosting.count());
  console.log("   - Applications created:", await prisma.application.count());
  console.log("   - Events created:", await prisma.event.count());
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
