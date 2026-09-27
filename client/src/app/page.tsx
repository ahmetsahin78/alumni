import Link from "next/link";
import { 
  Users, 
  Search, 
  Award, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Kapsamlı Mezun Profilleri",
      desc: "Mevcut şirket, pozisyon, sektör, yetenek seti ve doğrulanmış akademik geçmiş detayları tek profil altında.",
    },
    {
      icon: Search,
      title: "Akıllı Arama ve Filtreleme",
      desc: "Mezunları konuma, mezuniyet yılına, sektöre veya mevcut çalıştığı şirkete göre saniyeler içinde bulun.",
    },
    {
      icon: Award,
      title: "Mentorluk & Kariyer Ağı",
      desc: "Mevcut öğrenciler ile sektör deneyimli mezunlar arasında toplantı talepleri ve rehberlik köprüsü kurun.",
    },
    {
      icon: Briefcase,
      title: "İş & Staj Portalı",
      desc: "Mezun topluluğuna özel şirket içi ve dışı staj, tam zamanlı ve hibrit kariyer fırsatlarını paylaşın.",
    },
    {
      icon: Calendar,
      title: "Etkinlik & Buluşma Yönetimi",
      desc: "Mezunlar günü, seminerler ve networking toplantıları düzenleyin; RSVP katılım durumlarını takip edin.",
    },
    {
      icon: BarChart3,
      title: "Yönetici & İstatistik Paneli",
      desc: "İstihdam oranları, sektör dağılım grafikleri ve mezun doğrulama onay akışlarını anlık izleyin.",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 px-4 text-center bg-gradient-to-b from-blue-50/50 via-white to-transparent dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <GraduationCap className="w-4 h-4" />
            <span>İstanbul Üniversitesi Mezunları Tek Çatı Altında</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Geleceği Şekillendiren <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Güçlü Mezun Topluluğu
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kariyer takibi, mentorluk bağlantıları, özel iş fırsatları ve kurumsal istatistikleri bir araya getiren yeni nesil mezun takip sistemi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5"
            >
              Topluluğa Katıl
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/alumni"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              <Search className="w-4 h-4" />
              Mezunları Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Neden Alumni Tracking System?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Eğitim hayatından profesyonel iş dünyasına kadar mezunlar ve öğrenciler arasındaki köprüyü güçlendiren modern modüller.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification Banner */}
      <section className="w-full max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/10">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4" />
              Doğrulanmış Üniversite Ağı
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Kariyer Yolculuğunuzu Mezun Ağıyla Hızlandırın
            </h3>
            <p className="text-blue-100 text-sm sm:text-base">
              İstanbul Üniversitesi mezunlar veri tabanına dahil olun, öğrencilere mentorluk yapın veya yeni kariyer fırsatlarını yakalayın.
            </p>
          </div>
          <Link
            href="/register"
            className="px-6 py-3.5 rounded-xl font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-md shrink-0"
          >
            Hemen Üye Olun
          </Link>
        </div>
      </section>
    </div>
  );
}
