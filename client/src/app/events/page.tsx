"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Video, 
  Plus, 
  Check, 
  Clock, 
  X,
  ExternalLink 
} from "lucide-react";
import { api } from "@/lib/api";

const MOCK_EVENTS = [
  {
    id: "event-1",
    title: "2026 Geleneksel Beyazıt Mezunlar Buluşması & Kariyer Günü",
    description: "İstanbul Üniversitesi tarihi Beyazıt Kampüsü'nde tüm dönemlerden mezunlarımız ve öğrencilerimiz bir araya geliyor. Rektörlük bahçesinde kokteyl, sektör panelleri ve networking oturumları.",
    location: "Beyazıt Kampüsü Rektörlük Bahçesi, İstanbul",
    eventDate: "2026-10-15T14:00:00Z",
    isOnline: false,
    maxAttendees: 500,
    organizer: {
      profile: { firstName: "Sistem", lastName: "Yöneticisi" },
    },
    _count: { rsvps: 184 },
  },
  {
    id: "event-2",
    title: "Webinar: Küresel Yazılım Kariyeri ve Yurt Dışı Fırsatları",
    description: "Avrupa ve Amerika'da çalışan mezunlarımız, uluslararası teknoloji şirketlerine başvuru süreçlerini, teknik mülakat hazırlıklarını ve çalışma vizelerini anlatıyor.",
    location: "Online / Google Meet",
    eventDate: "2026-10-28T19:00:00Z",
    isOnline: true,
    meetingUrl: "https://meet.google.com/xyz-alumni-talk",
    maxAttendees: 250,
    organizer: {
      profile: { firstName: "Ahmet", lastName: "Yılmaz" },
    },
    _count: { rsvps: 92 },
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(MOCK_EVENTS);
  const [myRsvps, setMyRsvps] = useState<Record<string, string>>({ "event-1": "ATTENDING" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    isOnline: false,
    meetingUrl: "",
    maxAttendees: "",
  });

  const handleRsvp = (eventId: string, status: "ATTENDING" | "MAYBE") => {
    setMyRsvps((prev) => ({ ...prev, [eventId]: status }));
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            _count: {
              ...e._count,
              rsvps: myRsvps[eventId] === "ATTENDING" ? e._count.rsvps : e._count.rsvps + 1,
            },
          };
        }
        return e;
      })
    );
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `event-${Date.now()}`,
      ...newEvent,
      _count: { rsvps: 1 },
      organizer: { profile: { firstName: "Ben", lastName: "(Siz)" } },
    };
    setEvents([created, ...events]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Etkinlikler & Mezun Buluşmaları
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Seminerler, networking etkinlikleri ve geleneksel üniversite buluşmaları
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Etkinlik Düzenle
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => {
          const date = new Date(event.eventDate);
          const isAttending = myRsvps[event.id] === "ATTENDING";

          return (
            <div
              key={event.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        event.isOnline
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {event.isOnline ? "💻 Çevrim İçi Webinar" : "🏛️ Yüz Yüze Buluşma"}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Users className="w-4 h-4 text-blue-500" />
                    {event._count?.rsvps || 0} Katılımcı
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                {event.meetingUrl && (
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-between text-xs">
                    <span className="text-purple-900 dark:text-purple-300 font-medium">
                      Toplantı Linki Mevcut
                    </span>
                    <a
                      href={event.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-purple-600 font-bold hover:underline"
                    >
                      Odaya Gir <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* RSVP Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Düzenleyen: {event.organizer?.profile?.firstName} {event.organizer?.profile?.lastName}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRsvp(event.id, "ATTENDING")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isAttending
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> {isAttending ? "Katılıyorsunuz" : "Katılacağım"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Yeni Etkinlik Düzenle
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Etkinlik Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Örn: 2026 Mühendislik Mezunları Zirvesi"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tarih ve Saat
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maksimum Katılımcı
                  </label>
                  <input
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                    placeholder="Örn: 100"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konum veya Çevrim İçi Platform
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Örn: Beyazıt Kampüsü Kongre Merkezi veya Zoom"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detaylı Açıklama
                </label>
                <textarea
                  required
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Etkinlik gündemi, konuşmacılar..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  Etkinliği Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
