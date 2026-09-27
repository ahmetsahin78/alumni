"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  Users, 
  MessageSquare, 
  Video, 
  Clock, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Search,
  ArrowRight
} from "lucide-react";
import { api, MOCK_ALUMNI } from "@/lib/api";

const MOCK_REQUESTS = [
  {
    id: "req-1",
    mentor: {
      profile: { firstName: "Ahmet", lastName: "Yılmaz", headline: "Senior Software Engineer @ TechCorp" },
    },
    mentee: {
      profile: { firstName: "Can", lastName: "Öztürk", headline: "3. Sınıf Öğrencisi" },
    },
    message: "Backend kariyer adımları ve açık kaynak projelere katkı sağlamak hakkında fikirlerinizi rica ediyorum.",
    status: "ACCEPTED",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    createdAt: "2026-09-25T11:00:00Z",
  },
  {
    id: "req-2",
    mentor: {
      profile: { firstName: "Zeynep", lastName: "Kaya", headline: "Product Manager @ FinScale" },
    },
    mentee: {
      profile: { firstName: "Can", lastName: "Öztürk", headline: "3. Sınıf Öğrencisi" },
    },
    message: "Yazılım geçmişiyle ürün yönetimine nasıl geçiş yapabilirim? Tavsiyeleriniz benim için çok kıymetli.",
    status: "PENDING",
    createdAt: "2026-09-26T15:20:00Z",
  },
];

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState<"mentors" | "my_requests">("mentors");
  const mentors = MOCK_ALUMNI.filter((a) => a.profile.isMentor);
  const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await api.get("/mentorship/requests");
      if (res.data?.data && res.data.data.length > 0) {
        setRequests(res.data.data);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mentorluk & Kariyer Köprüsü
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Öğrencilerimiz ve deneyimli mezunlarımız arasında birebir kariyer rehberliği ve görüşme ağı.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("mentors")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "mentors"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="w-4 h-4" /> Aktif Mentorlar ({mentors.length})
        </button>
        <button
          onClick={() => setActiveTab("my_requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "my_requests"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Mentorluk Taleplerim ({requests.length})
        </button>
      </div>

      {/* Tab 1: Mentor Grid */}
      {activeTab === "mentors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((m) => {
            const initials = `${m.profile.firstName?.[0] || ""}${m.profile.lastName?.[0] || ""}`;
            return (
              <div
                key={m.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {m.profile.firstName} {m.profile.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {m.academicHistories[0]?.department}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {m.profile.headline}
                  </p>

                  {m.profile.mentorshipTopics && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
                      <strong>Rehberlik Konuları:</strong> <br />
                      {m.profile.mentorshipTopics}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/alumni/${m.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all"
                  >
                    Görüşme Talep Et <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: My Requests */}
      {activeTab === "my_requests" && (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Mentor: {req.mentor?.profile?.firstName} {req.mentor?.profile?.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {req.mentor?.profile?.headline}
                  </p>
                </div>

                <div>
                  {req.status === "ACCEPTED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5" /> Kabul Edildi
                    </span>
                  ) : req.status === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                      <XCircle className="w-3.5 h-3.5" /> Reddedildi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      <Clock className="w-3.5 h-3.5" /> Yanıt Bekleniyor
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <strong>Mesajınız:</strong> {req.message}
              </div>

              {req.meetingUrl && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Toplantı Bağlantısı Hazır!</span>
                  </div>
                  <a
                    href={req.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Görüşmeye Katıl <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
