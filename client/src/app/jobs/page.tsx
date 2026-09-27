"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Plus, 
  ExternalLink, 
  Building2, 
  Clock, 
  CheckCircle,
  X
} from "lucide-react";
import { api } from "@/lib/api";

const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Junior Backend Developer",
    company: "TechCorp",
    location: "İstanbul (Hibrit)",
    type: "FULL_TIME",
    industry: "Teknoloji",
    description: "Ekibimize katılacak hevesli Junior Backend Geliştirici arıyoruz. Node.js ve SQL deneyimi olan mezunlar önceliklidir.",
    requirements: "Node.js/TypeScript temeli, REST API kavramları, Git bilgisi.",
    applicationUrl: "https://example.com/apply-1",
    salaryRange: "₺45.000 - ₺60.000",
    author: {
      profile: { firstName: "Ahmet", lastName: "Yılmaz" },
    },
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "job-2",
    title: "Yaz Stajyeri - Veri Analitiği",
    company: "Global Analytics",
    location: "İstanbul (Uzaktan)",
    type: "INTERNSHIP",
    industry: "Teknoloji",
    description: "Büyük veri projelerinde görev alacak, Python ve SQL bilen 3. ve 4. sınıf öğrencileri için staj imkanı.",
    requirements: "Python (Pandas, Numpy), Temel SQL bilgisi, problem çözme becerisi.",
    applicationUrl: "https://example.com/apply-2",
    salaryRange: "Ücretli Staj",
    author: {
      profile: { firstName: "Elif", lastName: "Aydın" },
    },
    createdAt: "2026-09-22T14:30:00Z",
  },
  {
    id: "job-3",
    title: "Product Operations Specialist",
    company: "FinScale",
    location: "Londra / Hibrit",
    type: "FULL_TIME",
    industry: "Finans",
    description: "FinTech ürün süreçlerinin operasyonel yönetiminde çalışacak, dinamik takım arkadaşı arıyoruz.",
    requirements: "İktisat veya Mühendislik mezunu, akıcı İngilizce, analitik düşünme.",
    applicationUrl: "https://example.com/apply-3",
    salaryRange: "£38,000 - £48,000 / yıl",
    author: {
      profile: { firstName: "Zeynep", lastName: "Kaya" },
    },
    createdAt: "2026-09-24T09:15:00Z",
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "İstanbul",
    type: "FULL_TIME",
    industry: "Teknoloji",
    description: "",
    requirements: "",
    applicationUrl: "",
    salaryRange: "",
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?search=${searchTerm}&type=${selectedType}`);
      if (res.data?.data && res.data.data.length > 0) {
        setJobs(res.data.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedType]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", newJob);
      if (res.data?.data) {
        setJobs([res.data.data, ...jobs]);
      } else {
        setJobs([{ id: `job-${Date.now()}`, ...newJob, createdAt: new Date().toISOString() }, ...jobs]);
      }
      setIsModalOpen(false);
      setNewJob({
        title: "",
        company: "",
        location: "İstanbul",
        type: "FULL_TIME",
        industry: "Teknoloji",
        description: "",
        requirements: "",
        applicationUrl: "",
        salaryRange: "",
      });
    } catch {
      setJobs([{ id: `job-${Date.now()}`, ...newJob, createdAt: new Date().toISOString() }, ...jobs]);
      setIsModalOpen(false);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || j.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            İş & Staj Portalı
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Mezun ağımız tarafından paylaşılan özel kariyer ve staj ilanları
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Yeni İlan Paylaş
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pozisyon, şirket veya anahtar kelime..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          {["", "FULL_TIME", "INTERNSHIP", "REMOTE"].map((type) => {
            const label =
              type === "" ? "Tümü" : type === "FULL_TIME" ? "Tam Zamanlı" : type === "INTERNSHIP" ? "Staj" : "Uzaktan";
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedType === type
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {job.type === "FULL_TIME" ? "Tam Zamanlı" : job.type === "INTERNSHIP" ? "Staj" : "Uzaktan"}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {job.industry}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {job.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" /> {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  {job.salaryRange && (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      💰 {job.salaryRange}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {job.description}
              </p>

              {job.requirements && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Aranan Nitelikler:</strong> {job.requirements}
                </div>
              )}
            </div>

            <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                {new Date(job.createdAt).toLocaleDateString("tr-TR")}
              </span>
              <a
                href={job.applicationUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Başvur <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* New Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Yeni Kariyer / Staj İlanı Paylaş
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pozisyon Başlığı
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="Örn: Frontend Developer"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    required
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="Örn: Trendyol"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Çalışma Şekli
                  </label>
                  <select
                    value={newJob.type}
                    onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="FULL_TIME">Tam Zamanlı</option>
                    <option value="INTERNSHIP">Staj</option>
                    <option value="REMOTE">Uzaktan</option>
                    <option value="PART_TIME">Yarı Zamanlı</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Konum
                  </label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="İstanbul (Hibrit)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maaş / Ücret Bilgisi
                  </label>
                  <input
                    type="text"
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                    placeholder="Opsiyonel"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Açıklama & Sorumluluklar
                </label>
                <textarea
                  required
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="İşin detayları..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Aranan Yetenekler / Nitelikler
                </label>
                <input
                  type="text"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  placeholder="Örn: React, Tailwind, Git..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Başvuru Bağlantısı (URL)
                </label>
                <input
                  type="url"
                  value={newJob.applicationUrl}
                  onChange={(e) => setNewJob({ ...newJob, applicationUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  İlanı Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
