"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Building2, 
  GraduationCap 
} from "lucide-react";
import { api } from "@/lib/api";

const MOCK_STATS = {
  overview: {
    totalUsers: 1420,
    totalAlumni: 890,
    totalStudents: 520,
    totalMentors: 114,
    totalJobs: 48,
    totalEvents: 12,
    employedAlumniCount: 785,
    employmentRate: 88,
    unverifiedAlumni: 4,
  },
  charts: {
    industryDistribution: [
      { name: "Teknoloji / Yazılım", count: 320, percentage: 36 },
      { name: "Finans & Bankacılık", count: 210, percentage: 24 },
      { name: "Hukuk & Danışmanlık", count: 145, percentage: 16 },
      { name: "Sağlık & Biyoteknoloji", count: 110, percentage: 12 },
      { name: "Eğitim & Akademi", count: 70, percentage: 8 },
      { name: "Diğer Sektörler", count: 35, percentage: 4 },
    ],
    topCompanies: [
      { company: "TechCorp", count: 42 },
      { company: "FinScale", count: 28 },
      { company: "Global Analytics", count: 24 },
      { company: "Demir Hukuk", count: 18 },
      { company: "Trendyol", count: 15 },
    ],
    graduationYearDistribution: [
      { year: 2020, count: 160 },
      { year: 2021, count: 180 },
      { year: 2022, count: 210 },
      { year: 2023, count: 240 },
      { year: 2024, count: 100 },
    ],
  },
};

const MOCK_PENDING_USERS = [
  {
    id: "p-1",
    email: "berkay.k@example.com",
    role: "ALUMNI",
    isVerified: false,
    profile: {
      firstName: "Berkay",
      lastName: "Korkmaz",
      headline: "Frontend Dev @ SoftSolutions",
    },
    academicHistories: [
      { department: "Bilgisayar Mühendisliği", graduationYear: 2022 },
    ],
  },
  {
    id: "p-2",
    email: "selin.t@example.com",
    role: "ALUMNI",
    isVerified: false,
    profile: {
      firstName: "Selin",
      lastName: "Tekin",
      headline: "Junior Financial Analyst @ Akbank",
    },
    academicHistories: [
      { department: "İktisat", graduationYear: 2023 },
    ],
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [pendingUsers, setPendingUsers] = useState<any[]>(MOCK_PENDING_USERS);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await api.get("/admin/statistics");
      if (statsRes.data?.data) {
        setStats(statsRes.data.data);
      }
      const pendingRes = await api.get("/admin/verifications");
      if (pendingRes.data?.data) {
        setPendingUsers(pendingRes.data.data);
      }
    } catch {
      // Keep mock stats in dev
    }
  };

  const handleVerify = async (userId: string, approve: boolean) => {
    try {
      await api.patch(`/admin/verifications/${userId}`, { isVerified: approve });
    } catch {
      // Local fallback
    }

    setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    setActionMessage(
      approve ? "Mezun kaydı onaylandı ve rozet tanımlandı." : "Mezun kaydı reddedildi."
    );
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Kurumsal Yönetici & İstatistik Paneli
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          İstanbul Üniversitesi mezun istihdam oranları, sektör dağılımları ve hesap doğrulama onay akışı.
        </p>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Kayıtlı Mezunlar
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.overview.totalAlumni}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Toplam {stats.overview.totalUsers} sistem kullanıcısı
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Mezun İstihdam Oranı
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              %{stats.overview.employmentRate}
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: `${stats.overview.employmentRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Gönüllü Mentor Sayısı
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.overview.totalMentors}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Öğrencilere aktif rehberlik eden mezunlar
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Onay Bekleyen Mezunlar
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {pendingUsers.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Diploma doğrulaması gereken kayıtlar
            </p>
          </div>
        </div>
      </div>

      {/* Analytics & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" /> Sektörel Dağılım Grafiği
          </h2>
          <div className="space-y-3 pt-2">
            {stats.charts.industryDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="text-slate-500">
                    {item.count} mezun (%{item.percentage || Math.round((item.count / 890) * 100)})
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage || Math.round((item.count / 890) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies Hiring Alumni */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" /> En Çok Mezun İstihdam Eden Şirketler
          </h2>
          <div className="space-y-3 pt-2">
            {stats.charts.topCompanies.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {c.company}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {c.count} Mezun Çalışan
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Verification Approval Workflow */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Mezun Doğrulama Akışı
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              İstanbul Üniversitesi diplomasını doğrulamak için inceleme bekleyen kullanıcılar
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
            {pendingUsers.length} Bekleyen
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            Tüm mezun doğrulama talepleri onaylandı. Bekleyen işlem bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3">Ad Soyad</th>
                  <th className="py-3 px-3">E-Posta</th>
                  <th className="py-3 px-3">Bölüm & Yıl</th>
                  <th className="py-3 px-3">Mevcut Unvan</th>
                  <th className="py-3 px-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                      {user.academicHistories?.[0]?.department} ({user.academicHistories?.[0]?.graduationYear})
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {user.profile?.headline || "-"}
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleVerify(user.id, true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Onayla
                      </button>
                      <button
                        onClick={() => handleVerify(user.id, false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-700 dark:text-red-300 font-semibold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reddet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
