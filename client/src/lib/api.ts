import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("alumni_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Mock Data for Seamless Demo / Frontend Preview when backend is starting
export const MOCK_ALUMNI = [
  {
    id: "alumni-1",
    email: "alumni.ahmet@example.com",
    role: "ALUMNI",
    isVerified: true,
    avatarUrl: null,
    profile: {
      firstName: "Ahmet",
      lastName: "Yılmaz",
      headline: "Senior Software Engineer @ TechCorp",
      bio: "İ.Ü. Bilgisayar Mühendisliği 2020 mezunuyum. Cloud computing, Distributed Systems ve Node.js/Go konularında çalışıyorum. Öğrencilere kariyer rehberliği sunmaktan mutluluk duyarım.",
      location: "İstanbul, Türkiye",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      isMentor: true,
      mentorshipTopics: "Backend Mimarileri, Kariyer Tavsiyesi, Yurt Dışı İlanları",
    },
    academicHistories: [
      {
        id: "ac-1",
        university: "İstanbul Üniversitesi",
        faculty: "Mühendislik Fakültesi",
        department: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        startYear: 2016,
        graduationYear: 2020,
      },
    ],
    workExperiences: [
      {
        id: "we-1",
        company: "TechCorp",
        position: "Senior Software Engineer",
        industry: "Teknoloji",
        location: "İstanbul",
        isCurrent: true,
        startDate: "2022-01-01",
        description: "Yüksek hacimli mikroservis altyapılarının yönetimi ve bulut geçişleri.",
      },
      {
        id: "we-2",
        company: "StartupLab",
        position: "Full Stack Developer",
        industry: "Teknoloji",
        location: "İstanbul",
        isCurrent: false,
        startDate: "2020-07-01",
        endDate: "2021-12-31",
      },
    ],
    skills: [
      { skill: { name: "Node.js" } },
      { skill: { name: "TypeScript" } },
      { skill: { name: "PostgreSQL" } },
      { skill: { name: "Docker" } },
      { skill: { name: "AWS" } },
    ],
  },
  {
    id: "alumni-2",
    email: "alumni.zeynep@example.com",
    role: "ALUMNI",
    isVerified: true,
    avatarUrl: null,
    profile: {
      firstName: "Zeynep",
      lastName: "Kaya",
      headline: "Lead Product Manager @ FinScale",
      bio: "İktisat 2018 mezunuyum. Londra ve İstanbul merkezli FinTech projelerinde ürün ve büyüme stratejilerini yönetiyorum.",
      location: "Londra, Birleşik Krallık",
      linkedinUrl: "https://linkedin.com",
      isMentor: true,
      mentorshipTopics: "Ürün Yönetimi, FinTech, Uluslararası Kariyer",
    },
    academicHistories: [
      {
        id: "ac-2",
        university: "İstanbul Üniversitesi",
        faculty: "İktisat Fakültesi",
        department: "İktisat",
        degree: "Lisans",
        startYear: 2014,
        graduationYear: 2018,
      },
    ],
    workExperiences: [
      {
        id: "we-3",
        company: "FinScale",
        position: "Lead Product Manager",
        industry: "Finans",
        location: "Londra",
        isCurrent: true,
        startDate: "2021-03-01",
        description: "B2B dijital ödeme altyapıları ürün liderliği.",
      },
    ],
    skills: [
      { skill: { name: "Product Management" } },
      { skill: { name: "Data Analysis" } },
      { skill: { name: "Agile" } },
      { skill: { name: "FinTech" } },
    ],
  },
  {
    id: "alumni-3",
    email: "alumni.mehmet@example.com",
    role: "ALUMNI",
    isVerified: true,
    avatarUrl: null,
    profile: {
      firstName: "Mehmet",
      lastName: "Demir",
      headline: "Avukat & Hukuk Danışmanı @ Demir Hukuk",
      bio: "Hukuk Fakültesi 2017 mezunu. Bilişim ve fikri mülkiyet hukuku alanında şirketlere danışmanlık veriyorum.",
      location: "Ankara, Türkiye",
      linkedinUrl: "https://linkedin.com",
      isMentor: false,
    },
    academicHistories: [
      {
        id: "ac-3",
        university: "İstanbul Üniversitesi",
        faculty: "Hukuk Fakültesi",
        department: "Hukuk",
        degree: "Lisans",
        startYear: 2013,
        graduationYear: 2017,
      },
    ],
    workExperiences: [
      {
        id: "we-4",
        company: "Demir Hukuk Bürosu",
        position: "Ortak Avukat",
        industry: "Hukuk / Danışmanlık",
        location: "Ankara",
        isCurrent: true,
        startDate: "2019-01-01",
      },
    ],
    skills: [
      { skill: { name: "Bilişim Hukuku" } },
      { skill: { name: "KVKK" } },
      { skill: { name: "Sözleşme Yönetimi" } },
    ],
  },
  {
    id: "alumni-4",
    email: "alumni.elif@example.com",
    role: "ALUMNI",
    isVerified: true,
    avatarUrl: null,
    profile: {
      firstName: "Elif",
      lastName: "Aydın",
      headline: "Data Scientist @ Global Analytics",
      bio: "Matematik ve Bilgisayar mezunu. Büyük veri analitiği, makine öğrenmesi ve NLP modelleri geliştiriyorum.",
      location: "İstanbul, Türkiye",
      linkedinUrl: "https://linkedin.com",
      githubUrl: "https://github.com",
      isMentor: true,
      mentorshipTopics: "Veri Bilimi, Python, Yapay Zeka Kariyeri",
    },
    academicHistories: [
      {
        id: "ac-4",
        university: "İstanbul Üniversitesi",
        faculty: "Fen Fakültesi",
        department: "Matematik",
        degree: "Lisans",
        startYear: 2015,
        graduationYear: 2019,
      },
    ],
    workExperiences: [
      {
        id: "we-5",
        company: "Global Analytics",
        position: "Senior Data Scientist",
        industry: "Teknoloji",
        location: "İstanbul",
        isCurrent: true,
        startDate: "2021-08-01",
      },
    ],
    skills: [
      { skill: { name: "Python" } },
      { skill: { name: "Machine Learning" } },
      { skill: { name: "SQL" } },
      { skill: { name: "PyTorch" } },
    ],
  },
];
