"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  X,
  ArrowRight
} from "lucide-react";
import { api, MOCK_ALUMNI } from "@/lib/api";

export default function AlumniDirectoryPage() {
  const [alumniList, setAlumniList] = useState<any[]>(MOCK_ALUMNI);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [onlyMentors, setOnlyMentors] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, [selectedDept, selectedYear, selectedIndustry, onlyMentors]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedDept) params.append("department", selectedDept);
      if (selectedYear) params.append("graduationYear", selectedYear);
      if (selectedIndustry) params.append("industry", selectedIndustry);
      if (onlyMentors) params.append("isMentor", "true");

      const res = await api.get(`/alumni?${params.toString()}`);
      if (res.data?.data && res.data.data.length > 0) {
        setAlumniList(res.data.data);
      } else {
        // Filter mock data locally if API returned empty or during dev
        let filtered = [...MOCK_ALUMNI];
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (a) =>
              a.profile.firstName.toLowerCase().includes(q) ||
              a.profile.lastName.toLowerCase().includes(q) ||
              a.profile.headline?.toLowerCase().includes(q) ||
              a.academicHistories[0]?.department.toLowerCase().includes(q) ||
              a.workExperiences[0]?.company.toLowerCase().includes(q)
          );
        }
        if (selectedDept) {
          filtered = filtered.filter((a) => a.academicHistories[0]?.department === selectedDept);
        }
        if (selectedYear) {
          filtered = filtered.filter((a) => a.academicHistories[0]?.graduationYear === Number(selectedYear));
        }
        if (selectedIndustry) {
          filtered = filtered.filter((a) => a.workExperiences[0]?.industry === selectedIndustry);
        }
        if (onlyMentors) {
          filtered = filtered.filter((a) => a.profile.isMentor);
        }
        setAlumniList(filtered);
      }
    } catch (error) {
      // Fallback to local filter of mock data
      let filtered = [...MOCK_ALUMNI];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.profile.firstName.toLowerCase().includes(q) ||
            a.profile.lastName.toLowerCase().includes(q) ||
            a.profile.headline?.toLowerCase().includes(q)
        );
      }
      if (selectedDept) {
        filtered = filtered.filter((a) => a.academicHistories[0]?.department === selectedDept);
      }
      if (selectedYear) {
        filtered = filtered.filter((a) => a.academicHistories[0]?.graduationYear === Number(selectedYear));
      }
      if (onlyMentors) {
        filtered = filtered.filter((a) => a.profile.isMentor);
      }
      setAlumniList(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAlumni();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDept("");
    setSelectedYear("");
    setSelectedIndustry("");
    setOnlyMentors(false);
    setAlumniList(MOCK_ALUMNI);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Mezun Rehberi ve Akıllı Arama
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
          İstanbul Üniversitesi mezunlarını departman, mezuniyet yılı, sektör veya mevcut şirketlerine göre keşfedin.
        </p>
      </div>

      {/* Search & Filters Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İsim, unvan, şirket, departman veya anahtar kelime ile arayın..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shrink-0 shadow-sm shadow-blue-500/20"
          >
            Ara
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Bölüm / Departman
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Bölümler</option>
              <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
              <option value="İktisat">İktisat</option>
              <option value="Hukuk">Hukuk</option>
              <option value="Matematik">Matematik</option>
              <option value="İşletme">İşletme</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Mezuniyet Yılı
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Yıllar</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Sektör
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tüm Sektörler</option>
              <option value="Teknoloji">Teknoloji</option>
              <option value="Finans">Finans</option>
              <option value="Hukuk / Danışmanlık">Hukuk / Danışmanlık</option>
              <option value="Sağlık">Sağlık</option>
            </select>
          </div>

          <div className="flex items-center sm:justify-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyMentors}
                onChange={(e) => setOnlyMentors(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <Award className="w-4 h-4 text-emerald-500" />
              Yalnızca Mentorlar
            </label>
          </div>
        </div>

        {(searchTerm || selectedDept || selectedYear || selectedIndustry || onlyMentors) && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              {alumniList.length} mezun bulundu
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
            >
              <X className="w-3.5 h-3.5" /> Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniList.map((alumni) => {
          const currentJob = alumni.workExperiences?.[0];
          const latestEdu = alumni.academicHistories?.[0];
          const initials = `${alumni.profile.firstName?.[0] || ""}${alumni.profile.lastName?.[0] || ""}`;

          return (
            <div
              key={alumni.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all group"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors">
                          {alumni.profile.firstName} {alumni.profile.lastName}
                        </h3>
                        {alumni.isVerified && (
                          <span title="Doğrulanmış Mezun">
                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      {alumni.profile.location && (
                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3 h-3" /> {alumni.profile.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {alumni.profile.isMentor && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Award className="w-3 h-3" /> Mentor
                    </span>
                  )}
                </div>

                {/* Headline */}
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                  {alumni.profile.headline || "İstanbul Üniversitesi Mezunu"}
                </p>

                {/* Academic & Work info */}
                <div className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  {currentJob && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">
                        <strong>{currentJob.position}</strong> — {currentJob.company}
                      </span>
                    </div>
                  )}
                  {latestEdu && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">
                        {latestEdu.department} ({latestEdu.graduationYear})
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                {alumni.skills && alumni.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {alumni.skills.slice(0, 4).map((s: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {s.skill?.name || s.name}
                      </span>
                    ))}
                    {alumni.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{alumni.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/alumni/${alumni.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all group-hover:bg-blue-600 group-hover:text-white"
                >
                  Profili İncele
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {alumniList.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Arama kriterlerinize uygun mezun bulunamadı.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
