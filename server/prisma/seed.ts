import { PrismaClient, Role, JobType, RSVPStatus, MentorshipStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data
  await prisma.eventRSVP.deleteMany();
  await prisma.event.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.mentorshipRequest.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.academicHistory.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: "admin@istanbul.edu.tr",
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
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

  // 2. Create Alumni Users
  const alumni1 = await prisma.user.create({
    data: {
      email: "alumni.ahmet@example.com",
      passwordHash,
      role: Role.ALUMNI,
      isVerified: true,
      profile: {
        create: {
          firstName: "Ahmet",
          lastName: "Yılmaz",
          headline: "Senior Software Engineer @ TechCorp",
          bio: "İ.Ü. Bilgisayar Mühendisliği 2020 mezunuyum. Cloud computing, Distributed Systems ve Node.js/Go konularında çalışıyorum.",
          location: "İstanbul, Türkiye",
          linkedinUrl: "https://linkedin.com/in/example-ahmet",
          githubUrl: "https://github.com/example-ahmet",
          isMentor: true,
          mentorshipTopics: "Kariyer Tavsiyesi, Backend Geliştirme, Yurt Dışı İş İmkanları",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "Mühendislik Fakültesi",
          department: "Bilgisayar Mühendisliği",
          degree: "Lisans",
          startYear: 2016,
          graduationYear: 2020,
        },
      },
      workExperiences: {
        create: [
          {
            company: "TechCorp",
            position: "Senior Software Engineer",
            industry: "Teknoloji / Yazılım",
            location: "İstanbul",
            startDate: new Date("2022-01-01"),
            isCurrent: true,
            description: "Mikroservis mimarileri ve yüksek ölçekli sistemlerin geliştirilmesi.",
          },
          {
            company: "StartupLab",
            position: "Full Stack Developer",
            industry: "Teknoloji",
            location: "İstanbul",
            startDate: new Date("2020-07-01"),
            endDate: new Date("2021-12-31"),
            isCurrent: false,
            description: "React ve Node.js ile SaaS ürün geliştirme.",
          },
        ],
      },
    },
  });

  const alumni2 = await prisma.user.create({
    data: {
      email: "alumni.zeynep@example.com",
      passwordHash,
      role: Role.ALUMNI,
      isVerified: true,
      profile: {
        create: {
          firstName: "Zeynep",
          lastName: "Kaya",
          headline: "Product Manager @ FinScale",
          bio: "İktisat 2018 mezunu. FinTech alanında ürün yönetimi yapıyorum.",
          location: "Londra, Birleşik Krallık",
          linkedinUrl: "https://linkedin.com/in/example-zeynep",
          isMentor: true,
          mentorshipTopics: "Product Management, FinTech, Kariyer Geçişi",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "İktisat Fakültesi",
          department: "İktisat",
          degree: "Lisans",
          startYear: 2014,
          graduationYear: 2018,
        },
      },
      workExperiences: {
        create: {
          company: "FinScale",
          position: "Lead Product Manager",
          industry: "Finans / FinTech",
          location: "Londra",
          startDate: new Date("2021-03-01"),
          isCurrent: true,
          description: "Kullanıcı deneyimi odaklı finansal ürünler geliştirme.",
        },
      },
    },
  });

  // 3. Create Student User
  const student1 = await prisma.user.create({
    data: {
      email: "student.can@istanbul.edu.tr",
      passwordHash,
      role: Role.STUDENT,
      isVerified: true,
      profile: {
        create: {
          firstName: "Can",
          lastName: "Öztürk",
          headline: "3. Sınıf Bilgisayar Mühendisliği Öğrencisi",
          bio: "Web geliştirme ve yapay zeka alanlarına ilgi duyuyorum. Mentorluk arayışındayım.",
          location: "İstanbul, Türkiye",
        },
      },
      academicHistories: {
        create: {
          university: "İstanbul Üniversitesi",
          faculty: "Mühendislik Fakültesi",
          department: "Bilgisayar Mühendisliği",
          degree: "Lisans",
          startYear: 2023,
          graduationYear: 2027,
        },
      },
    },
  });

  // 4. Create Skills
  const skillNames = ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker", "Product Management", "Python", "AWS"];
  for (const name of skillNames) {
    const skill = await prisma.skill.create({ data: { name } });
    if (["Node.js", "TypeScript", "Docker", "PostgreSQL"].includes(name)) {
      await prisma.userSkill.create({
        data: { userId: alumni1.id, skillId: skill.id },
      });
    }
  }

  // 5. Create Job Posting
  await prisma.jobPosting.create({
    data: {
      authorId: alumni1.id,
      title: "Junior Backend Developer",
      company: "TechCorp",
      location: "İstanbul (Hibrit)",
      type: JobType.FULL_TIME,
      industry: "Teknoloji",
      description: "Ekibimize katılacak hevesli Junior Backend Geliştirici arıyoruz. Node.js ve SQL deneyimi olan mezunlar önceliklidir.",
      requirements: "Node.js/TypeScript temeli, REST API kavramları, Git bilgisi.",
      applicationUrl: "https://techcorp.example/careers",
    },
  });

  // 6. Create Event
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

  // 7. RSVP
  await prisma.eventRSVP.create({
    data: {
      eventId: reunionEvent.id,
      userId: alumni1.id,
      status: RSVPStatus.ATTENDING,
    },
  });

  // 8. Mentorship Request
  await prisma.mentorshipRequest.create({
    data: {
      mentorId: alumni1.id,
      menteeId: student1.id,
      status: MentorshipStatus.ACCEPTED,
      message: "Merhaba Ahmet Abi, ben 3. sınıf öğrencisiyim. Backend geliştirme ve kariyer adımları hakkında rehberliğinizi rica ediyorum.",
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      notes: "Haftalık periyodik görüşme ayarlandı.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
