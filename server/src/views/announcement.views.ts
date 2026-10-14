/**
 * ============================================================================
 * Announcement HTML Views (MVC View Katmanı & Homework UI Arayüzü)
 * ============================================================================
 * Ödev Görevi (Homework): "Create interface to manage without database yet"
 * Duyuruların tarayıcı üzerinden kolayca incelenmesi, eklenmesi, düzenlenmesi
 * ve silinmesini sağlayan şık ve responsive Yönetim Arayüzü (Interface).
 * ============================================================================
 */

import { IAnnouncement } from "../models/Announcement.model";
import { renderLayout } from "./layout";

export class AnnouncementViews {
  /**
   * 1. Duyuru Yönetim Paneli ve Liste Arayüzü
   */
  public static renderList(
    announcements: IAnnouncement[],
    filters: { search?: string; category?: string } = {},
    alertMessage?: string
  ): string {
    const cards =
      announcements.length > 0
        ? announcements
            .map(
              (a) => `
            <div class="card" style="margin-bottom: 1.25rem; transition: transform 0.15s ease;">
              <div class="card-header" style="background: #fafafa;">
                <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                  <span class="badge ${
                    String(a.priority).toUpperCase() === "HIGH"
                      ? "badge-danger"
                      : String(a.priority).toUpperCase() === "MEDIUM"
                      ? "badge-warning"
                      : "badge-neutral"
                  }">${a.priority} Öncelik</span>

                  <span class="badge badge-primary">${a.category}</span>
                  <span style="font-size: 0.82rem; color: #64748b;">📅 ${a.publishedAt}</span>
                </div>

                <div style="display: flex; gap: 0.4rem;">
                  <a href="/announcements/${a.id}" class="btn btn-secondary btn-sm">🔍 İncele</a>
                  <a href="/announcements/${a.id}/edit" class="btn btn-secondary btn-sm">✏️ Düzenle</a>
                  <form action="/announcements/${a.id}/delete" method="POST" style="display: inline-block;" onsubmit="return confirm('Bu duyuru silinsin mi?');">
                    <button type="submit" class="btn btn-danger btn-sm">🗑️</button>
                  </form>
                </div>
              </div>

              <div class="card-body">
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
                  <a href="/announcements/${a.id}" style="text-decoration: none; color: inherit;">${a.title}</a>
                </h3>
                <p style="color: #334155; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1rem;">
                  ${a.content}
                </p>
                <div style="font-size: 0.85rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem;">
                  <span>✍️ Yayınlayan:</span>
                  <strong style="color: #1e293b;">${a.author}</strong>
                </div>
              </div>
            </div>
          `
            )
            .join("")
        : `
          <div class="card">
            <div class="card-body" style="text-align: center; padding: 3rem; color: #64748b;">
              <p style="font-size: 1.15rem; font-weight: 600;">Herhangi bir duyuru bulunamadı.</p>
              <p style="margin-top: 0.5rem;"><a href="/announcements" class="btn btn-secondary btn-sm">Filtreyi Temizle</a></p>
            </div>
          </div>
        `;

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a;">📢 Duyuru ve Haber Panosu (Homework Interface)</h1>
          <p style="color: #64748b; font-size: 0.95rem;">Ödev gereksinimi: Veritabanı olmadan çalışan Duyuru Yönetim Arayüzü.</p>
        </div>
        <a href="/announcements/new" class="btn btn-primary" style="box-shadow: 0 4px 6px -1px rgba(37,99,235,0.25);">
          ➕ Yeni Duyuru Yayınla
        </a>
      </div>

      <!-- Filtreleme ve Arama Çubuğu -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-body" style="padding: 1rem 1.25rem;">
          <form method="GET" action="/announcements" style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <input 
              type="text" 
              name="search" 
              class="form-control" 
              placeholder="Duyuru başlığı, içerik veya yazara göre ara..." 
              value="${filters.search || ""}" 
              style="flex: 2; min-width: 200px;"
            >
            <select name="category" class="form-control" style="flex: 1; min-width: 150px;">
              <option value="">Tüm Kategoriler</option>
              <option value="General" ${filters.category === "General" ? "selected" : ""}>Genel</option>
              <option value="Event" ${filters.category === "Event" ? "selected" : ""}>Etkinlik</option>
              <option value="Career" ${filters.category === "Career" ? "selected" : ""}>Kariyer</option>
              <option value="Academic" ${filters.category === "Academic" ? "selected" : ""}>Akademik</option>
              <option value="Urgent" ${filters.category === "Urgent" ? "selected" : ""}>Acil</option>
            </select>
            <button type="submit" class="btn btn-primary">Filtrele</button>
            ${(filters.search || filters.category) ? `<a href="/announcements" class="btn btn-secondary">Temizle</a>` : ""}
            <div style="margin-left: auto; font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Toplam: <strong style="color: #0f172a;">${announcements.length}</strong> Duyuru
            </div>
          </form>
        </div>
      </div>

      <!-- Duyuru Listesi -->
      ${cards}
    `;

    return renderLayout(content, {
      title: "Duyurular Panosu (Yönetim Arayüzü)",
      activeNav: "announcements",
      alert: alertMessage ? { type: "success", message: alertMessage } : undefined,
    });
  }

  /**
   * 2. Tekil Duyuru Detay Görünümü
   */
  public static renderDetail(announcement: IAnnouncement): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/announcements" class="btn btn-secondary btn-sm">⬅️ Duyurulara Dön</a>
      </div>

      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-header" style="background: #f8fafc;">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="badge ${
              String(announcement.priority).toUpperCase() === "HIGH"
                ? "badge-danger"
                : String(announcement.priority).toUpperCase() === "MEDIUM"
                ? "badge-warning"
                : "badge-neutral"
            }">${announcement.priority} Öncelik</span>
            <span class="badge badge-primary">${announcement.category}</span>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <a href="/announcements/${announcement.id}/edit" class="btn btn-primary btn-sm">✏️ Düzenle</a>
            <form action="/announcements/${announcement.id}/delete" method="POST" style="display: inline-block;" onsubmit="return confirm('Bu duyuru silinsin mi?');">
              <button type="submit" class="btn btn-danger btn-sm">🗑️ Sil</button>
            </form>
          </div>
        </div>

        <div class="card-body">
          <h1 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">${announcement.title}</h1>
          <div style="display: flex; gap: 1.5rem; color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
            <span>📅 Tarih: <strong style="color: #1e293b;">${announcement.publishedAt}</strong></span>
            <span>✍️ Yazar: <strong style="color: #1e293b;">${announcement.author}</strong></span>
            <span>🆔 Duyuru ID: <strong style="color: #1e293b;">#${announcement.id}</strong></span>
          </div>

          <div style="font-size: 1.05rem; line-height: 1.7; color: #1e293b; white-space: pre-line;">
            ${announcement.content}
          </div>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: announcement.title,
      activeNav: "announcements",
    });
  }

  /**
   * 3. Yeni Duyuru Ekleme Formu
   */
  public static renderCreateForm(formData: any = {}, errorMessage?: string): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/announcements" class="btn btn-secondary btn-sm">⬅️ Listeye Dön</a>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">📢 Yeni Duyuru Oluştur</h2>
        </div>
        <div class="card-body">
          <form action="/announcements" method="POST">
            <div class="form-group">
              <label class="form-label" for="title">Duyuru Başlığı *</label>
              <input type="text" id="title" name="title" class="form-control" required placeholder="Duyuru başlığını giriniz..." value="${formData.title || ""}">
            </div>

            <div class="form-group">
              <label class="form-label" for="content">Duyuru İçeriği *</label>
              <textarea id="content" name="content" class="form-control" required placeholder="Duyuru metnini detaylıca yazınız...">${formData.content || ""}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="author">Yayınlayan Birim / Kişi *</label>
              <input type="text" id="author" name="author" class="form-control" required placeholder="Örn: Kariyer Merkezi, Mezunlar Koordinatörlüğü" value="${formData.author || ""}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="category">Kategori</label>
                <select id="category" name="category" class="form-control">
                  <option value="General" ${formData.category === "General" ? "selected" : ""}>Genel</option>
                  <option value="Event" ${formData.category === "Event" ? "selected" : ""}>Etkinlik</option>
                  <option value="Career" ${formData.category === "Career" ? "selected" : ""}>Kariyer</option>
                  <option value="Academic" ${formData.category === "Academic" ? "selected" : ""}>Akademik</option>
                  <option value="Urgent" ${formData.category === "Urgent" ? "selected" : ""}>Acil</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="priority">Öncelik Derecesi</label>
                <select id="priority" name="priority" class="form-control">
                  <option value="Low" ${formData.priority === "Low" ? "selected" : ""}>Düşük (Low)</option>
                  <option value="Medium" ${!formData.priority || formData.priority === "Medium" ? "selected" : ""}>Orta (Medium)</option>
                  <option value="High" ${formData.priority === "High" ? "selected" : ""}>Yüksek (High)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">📢 Duyuruyu Yayınla</button>
              <a href="/announcements" class="btn btn-secondary">İptal</a>
            </div>
          </form>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: "Yeni Duyuru Yayınla",
      activeNav: "announcements",
      alert: errorMessage ? { type: "error", message: errorMessage } : undefined,
    });
  }

  /**
   * 4. Duyuru Düzenleme Formu
   */
  public static renderEditForm(announcement: IAnnouncement, errorMessage?: string): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/announcements/${announcement.id}" class="btn btn-secondary btn-sm">⬅️ İptal ve Geri Dön</a>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">✏️ Duyuruyu Düzenle: #${announcement.id}</h2>
        </div>
        <div class="card-body">
          <form action="/announcements/${announcement.id}/edit" method="POST">
            <div class="form-group">
              <label class="form-label" for="title">Duyuru Başlığı *</label>
              <input type="text" id="title" name="title" class="form-control" required value="${announcement.title}">
            </div>

            <div class="form-group">
              <label class="form-label" for="content">Duyuru İçeriği *</label>
              <textarea id="content" name="content" class="form-control" required>${announcement.content}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="author">Yayınlayan Birim / Kişi *</label>
              <input type="text" id="author" name="author" class="form-control" required value="${announcement.author}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="category">Kategori</label>
                <select id="category" name="category" class="form-control">
                  <option value="General" ${String(announcement.category).toUpperCase() === "GENERAL" ? "selected" : ""}>Genel</option>
                  <option value="Event" ${String(announcement.category).toUpperCase() === "EVENT" ? "selected" : ""}>Etkinlik</option>
                  <option value="Career" ${String(announcement.category).toUpperCase() === "CAREER" ? "selected" : ""}>Kariyer</option>
                  <option value="Academic" ${String(announcement.category).toUpperCase() === "ACADEMIC" ? "selected" : ""}>Akademik</option>
                  <option value="Urgent" ${String(announcement.category).toUpperCase() === "URGENT" ? "selected" : ""}>Acil</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="priority">Öncelik Derecesi</label>
                <select id="priority" name="priority" class="form-control">
                  <option value="Low" ${String(announcement.priority).toUpperCase() === "LOW" ? "selected" : ""}>Düşük (Low)</option>
                  <option value="Medium" ${String(announcement.priority).toUpperCase() === "MEDIUM" ? "selected" : ""}>Orta (Medium)</option>
                  <option value="High" ${String(announcement.priority).toUpperCase() === "HIGH" ? "selected" : ""}>Yüksek (High)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">🔄 Değişiklikleri Kaydet</button>
              <a href="/announcements/${announcement.id}" class="btn btn-secondary">İptal</a>
            </div>
          </form>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: `Düzenle: #${announcement.id}`,
      activeNav: "announcements",
      alert: errorMessage ? { type: "error", message: errorMessage } : undefined,
    });
  }
}

