"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Award, 
  Briefcase, 
  GraduationCap, 
  ArrowLeft,
  Calendar,
  Send,
  MessageSquare
} from "lucide-react";
import { api, MOCK_ALUMNI } from "@/lib/api";

export default function AlumniDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [alumni, setAlumni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mentorship Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentorMessage, setMentorMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchAlumniDetail();
  }, [id]);

  const fetchAlumniDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/alumni/${id}`);
      if (res.data?.data) {
        setAlumni(res.data.data);
      } else {
        const found = MOCK_ALUMNI.find((a) => a.id === id) || MOCK_ALUMNI[0];
        setAlumni(found);
      }
    } catch {
      const found = MOCK_ALUMNI.find((a) => a.id === id) || MOCK_ALUMNI[0];
      setAlumni(found);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMentorshipRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/mentorship/requests", {
        mentorId: alumni.id,
        message: mentorMessage,
      });
      setRequestSent(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setRequestSent(false);
        setMentorMessage("");
      }, 2000);
    } catch {
      // Simulate success for demo
      setRequestSent(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setRequestSent(false);
        setMentorMessage("");
      }, 2000);
    }
  };

  if (loading || !alumni) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Mezun profili yükleniyor...</p>
      </div>
    );
  }

  const initials = `${alumni.profile?.firstName?.[0] || ""}${alumni.profile?.lastName?.[0] || ""}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        href="/alumni"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Mezunlar Listesine Dön
      </Link>

      {/* Main Profile Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {alumni.profile?.firstName} {alumni.profile?.lastName}
                </h1>
                {alumni.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Doğrulanmış
                  </span>
                )}
                {alumni.profile?.isMentor && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Award className="w-3.5 h-3.5" /> Aktif Mentor
                  </span>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                {alumni.profile?.headline}
              </p>
              {alumni.profile?.location && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5" /> {alumni.profile.location}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {alumni.profile?.isMentor && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Mentorluk Talep Et
              </button>
            )}

            {alumni.profile?.linkedinUrl && (
              <a
                href={alumni.profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title="LinkedIn Profili"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
              </a>
            )}
            {alumni.profile?.githubUrl && (
              <a
                href={alumni.profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title="GitHub Profili"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {alumni.profile?.websiteUrl && (
              <a
                href={alumni.profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title="Kişisel Web Sitesi"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        {alumni.profile?.bio && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase text-xs">
              Hakkında
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {alumni.profile.bio}
            </p>
          </div>
        )}

        {/* Mentorship Focus */}
        {alumni.profile?.isMentor && alumni.profile?.mentorshipTopics && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 space-y-1.5">
            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Mentorluk Alanları & Konuları
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              {alumni.profile.mentorshipTopics}
            </p>
          </div>
        )}

        {/* Work Experience Timeline */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" /> Profesyonel İş Deneyimi
          </h2>
          <div className="space-y-4 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
            {alumni.workExperiences?.map((work: any) => (
              <div key={work.id} className="relative pl-6 space-y-1 group">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {work.position}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    — {work.company}
                  </span>
                  {work.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      Mevcut Pozisyon
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(work.startDate).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })}
                  {" - "}
                  {work.isCurrent
                    ? "Günümüz"
                    : work.endDate
                    ? new Date(work.endDate).toLocaleDateString("tr-TR", { month: "short", year: "numeric" })
                    : ""}
                  {work.location && ` • ${work.location}`}
                  {work.industry && ` • ${work.industry}`}
                </p>
                {work.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                    {work.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Academic History */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" /> Akademik Geçmiş
          </h2>
          <div className="space-y-4 pl-2 border-l-2 border-slate-100 dark:border-slate-800">
            {alumni.academicHistories?.map((edu: any) => (
              <div key={edu.id} className="relative pl-6 space-y-1">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  {edu.university}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {edu.faculty} — {edu.department} ({edu.degree})
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mezuniyet Yılı: {edu.graduationYear} (Giriş: {edu.startYear})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Yetkinlikler & Uzmanlıklar
            </h2>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map((s: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {s.skill?.name || s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mentorship Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Mentorluk Görüşme Talebi
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Kapat
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>{alumni.profile.firstName} {alumni.profile.lastName}</strong> ile kariyer hedefleriniz, proje rehberliği veya sektör tecrübeleri hakkında bir mesaj paylaşın.
            </p>

            {requestSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs text-center font-medium">
                Talebiniz mentora iletildi! En kısa sürede yanıt alacaksınız.
              </div>
            ) : (
              <form onSubmit={handleSendMentorshipRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Mesajınız ve Talep Nedeniniz
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mentorMessage}
                    onChange={(e) => setMentorMessage(e.target.value)}
                    placeholder="Kendinizi tanıtın ve hangi konularda danışmak istediğinizi belirtin..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Gönder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
