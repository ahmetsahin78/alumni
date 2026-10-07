/**
 * ============================================================================
 * User HTML Views (MVC View Katmanı)
 * ============================================================================
 * Kullanıcı yönetimi için sunucu taraflı oluşturulan HTML sayfaları:
 * - Liste görünümü (GET /users)
 * - Detay görünümü (GET /users/:id)
 * - Yeni kayıt formu (GET /users/new & POST /users)
 * - Düzenleme formu (GET /users/:id/edit & POST /users/:id/edit)
 * ============================================================================
 */

import { IUser } from "../models/User.model";
import { renderLayout } from "./layout";

export class UserViews {
  /**
   * 1. Kullanıcı Listesi Sayfası (Read - All)
   */
  public static renderList(users: IUser[], search?: string, alertMessage?: string): string {
    const rows =
      users.length > 0
        ? users
            .map(
              (u) => `
            <tr>
              <td><strong>#${u.id}</strong></td>
              <td>
                <div style="font-weight: 700; color: #0f172a;">${u.name}</div>
                <div style="font-size: 0.8rem; color: #64748b;">${u.email}</div>
              </td>
              <td>
                <span class="badge ${
                  u.role === "Admin"
                    ? "badge-danger"
                    : u.role === "Faculty"
                    ? "badge-warning"
                    : u.role === "Student"
                    ? "badge-neutral"
                    : "badge-primary"
                }">${u.role}</span>
              </td>
              <td>${u.department}</td>
              <td><span class="badge badge-success">${u.graduationYear}</span></td>
              <td>${u.company || '<span style="color:#94a3b8;">Belirtilmedi</span>'}</td>
              <td style="white-space: nowrap; text-align: right;">
                <a href="/users/${u.id}" class="btn btn-secondary btn-sm" title="Detay">🔍 İncele</a>
                <a href="/users/${u.id}/edit" class="btn btn-secondary btn-sm" title="Düzenle">✏️ Düzenle</a>
                <form action="/users/${u.id}/delete" method="POST" style="display: inline-block;" onsubmit="return confirm('${u.name} kullanıcısını silmek istediğinize emin misiniz?');">
                  <button type="submit" class="btn btn-danger btn-sm" title="Sil">🗑️</button>
                </form>
              </td>
            </tr>
          `
            )
            .join("")
        : `
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem; color: #64748b;">
              <p style="font-size: 1.1rem; font-weight: 600;">Aradığınız kriterlere uygun kullanıcı bulunamadı.</p>
              <p style="margin-top: 0.5rem;"><a href="/users" class="btn btn-secondary btn-sm">Filtreyi Temizle</a></p>
            </td>
          </tr>
        `;

    const content = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a;">👤 Kullanıcı Yönetimi (View Katmanı)</h1>
          <p style="color: #64748b; font-size: 0.95rem;">MVC Mimarisi kapsamında sunucu taraflı render edilen dinamik HTML arayüzü.</p>
        </div>
        <a href="/users/new" class="btn btn-primary" style="box-shadow: 0 4px 6px -1px rgba(37,99,235,0.25);">
          ➕ Yeni Kullanıcı Ekle
        </a>
      </div>

      <!-- Arama ve İstatistik Çubuğu -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-body" style="padding: 1rem 1.25rem;">
          <form method="GET" action="/users" style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <input 
              type="text" 
              name="search" 
              class="form-control" 
              placeholder="İsim, e-posta veya bölüme göre ara..." 
              value="${search || ""}" 
              style="flex: 1; min-width: 250px;"
            >
            <button type="submit" class="btn btn-primary">🔍 Ara</button>
            ${search ? `<a href="/users" class="btn btn-secondary">Temizle</a>` : ""}
            <div style="margin-left: auto; font-size: 0.9rem; color: #64748b; font-weight: 600;">
              Toplam: <strong style="color: #0f172a;">${users.length}</strong> Kayıt
            </div>
          </form>
        </div>
      </div>

      <!-- Kullanıcı Tablosu -->
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">ID</th>
                <th>İsim & E-Posta</th>
                <th>Rol</th>
                <th>Bölüm</th>
                <th>Mezuniyet Yılı</th>
                <th>Şirket / Kurum</th>
                <th style="text-align: right;">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: "Kullanıcı Listesi (MVC View)",
      activeNav: "users",
      alert: alertMessage ? { type: "success", message: alertMessage } : undefined,
    });
  }

  /**
   * 2. Tekil Kullanıcı Detay Sayfası (Read - One)
   */
  public static renderDetail(user: IUser): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/users" class="btn btn-secondary btn-sm">⬅️ Kullanıcı Listesine Dön</a>
      </div>

      <div class="card" style="max-width: 800px; margin: 0 auto;">
        <div class="card-header" style="background: #f8fafc;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 2rem;">🎓</span>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a;">${user.name}</h2>
              <span class="badge ${
                user.role === "Admin"
                  ? "badge-danger"
                  : user.role === "Faculty"
                  ? "badge-warning"
                  : user.role === "Student"
                  ? "badge-neutral"
                  : "badge-primary"
              }">${user.role}</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="/users/${user.id}/edit" class="btn btn-primary btn-sm">✏️ Düzenle</a>
            <form action="/users/${user.id}/delete" method="POST" style="display: inline-block;" onsubmit="return confirm('Bu kullanıcı silinsin mi?');">
              <button type="submit" class="btn btn-danger btn-sm">🗑️ Sil</button>
            </form>
          </div>
        </div>

        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Kullanıcı ID</div>
              <div style="font-size: 1.1rem; font-weight: 600; color: #0f172a;">#${user.id}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">E-Posta</div>
              <div style="font-size: 1.05rem; font-weight: 600; color: #2563eb;">${user.email}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Bölüm</div>
              <div style="font-size: 1.05rem; font-weight: 600; color: #0f172a;">${user.department}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Mezuniyet Yılı</div>
              <div style="font-size: 1.05rem; font-weight: 600; color: #16a34a;">${user.graduationYear}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Çalıştığı Kurum / Şirket</div>
              <div style="font-size: 1.05rem; font-weight: 600; color: #0f172a;">${user.company || "Belirtilmedi"}</div>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Kayıt Tarihi</div>
              <div style="font-size: 0.95rem; color: #64748b;">${new Date(user.createdAt).toLocaleString("tr-TR")}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: `${user.name} - Kullanıcı Profili`,
      activeNav: "users",
    });
  }

  /**
   * 3. Yeni Kullanıcı Oluşturma Formu (Create - Form)
   */
  public static renderCreateForm(formData: any = {}, errorMessage?: string): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/users" class="btn btn-secondary btn-sm">⬅️ Listeye Dön</a>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">➕ Yeni Kullanıcı Kaydı Oluştur</h2>
        </div>
        <div class="card-body">
          <form action="/users" method="POST">
            <div class="form-group">
              <label class="form-label" for="name">Ad Soyad *</label>
              <input type="text" id="name" name="name" class="form-control" required placeholder="Örn: Ahmet Yılmaz" value="${formData.name || ""}">
            </div>

            <div class="form-group">
              <label class="form-label" for="email">E-Posta Adresi *</label>
              <input type="email" id="email" name="email" class="form-control" required placeholder="Örn: ahmet@istanbul.edu.tr" value="${formData.email || ""}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="role">Sistem Rolü</label>
                <select id="role" name="role" class="form-control">
                  <option value="Alumni" ${formData.role === "Alumni" ? "selected" : ""}>Mezun (Alumni)</option>
                  <option value="Student" ${formData.role === "Student" ? "selected" : ""}>Öğrenci (Student)</option>
                  <option value="Faculty" ${formData.role === "Faculty" ? "selected" : ""}>Akademisyen (Faculty)</option>
                  <option value="Admin" ${formData.role === "Admin" ? "selected" : ""}>Yönetici (Admin)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="graduationYear">Mezuniyet Yılı *</label>
                <input type="number" id="graduationYear" name="graduationYear" class="form-control" required placeholder="Örn: 2024" min="1950" max="2035" value="${formData.graduationYear || ""}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="department">Bölüm / Fakülte *</label>
              <input type="text" id="department" name="department" class="form-control" required placeholder="Örn: Bilgisayar Mühendisliği" value="${formData.department || ""}">
            </div>

            <div class="form-group">
              <label class="form-label" for="company">Mevcut Şirket / Pozisyon</label>
              <input type="text" id="company" name="company" class="form-control" placeholder="Örn: Google - Cloud Engineer" value="${formData.company || ""}">
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">💾 Kaydet ve Oluştur</button>
              <a href="/users" class="btn btn-secondary">İptal</a>
            </div>
          </form>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: "Yeni Kullanıcı Ekle",
      activeNav: "users",
      alert: errorMessage ? { type: "error", message: errorMessage } : undefined,
    });
  }

  /**
   * 4. Kullanıcı Güncelleme Formu (Update - Form)
   */
  public static renderEditForm(user: IUser, errorMessage?: string): string {
    const content = `
      <div style="margin-bottom: 1.5rem;">
        <a href="/users/${user.id}" class="btn btn-secondary btn-sm">⬅️ İptal ve Geri Dön</a>
      </div>

      <div class="card" style="max-width: 700px; margin: 0 auto;">
        <div class="card-header">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">✏️ Kullanıcı Düzenle: #${user.id} - ${user.name}</h2>
        </div>
        <div class="card-body">
          <form action="/users/${user.id}/edit" method="POST">
            <div class="form-group">
              <label class="form-label" for="name">Ad Soyad *</label>
              <input type="text" id="name" name="name" class="form-control" required value="${user.name}">
            </div>

            <div class="form-group">
              <label class="form-label" for="email">E-Posta Adresi *</label>
              <input type="email" id="email" name="email" class="form-control" required value="${user.email}">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="role">Sistem Rolü</label>
                <select id="role" name="role" class="form-control">
                  <option value="Alumni" ${user.role === "Alumni" ? "selected" : ""}>Mezun (Alumni)</option>
                  <option value="Student" ${user.role === "Student" ? "selected" : ""}>Öğrenci (Student)</option>
                  <option value="Faculty" ${user.role === "Faculty" ? "selected" : ""}>Akademisyen (Faculty)</option>
                  <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Yönetici (Admin)</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="graduationYear">Mezuniyet Yılı *</label>
                <input type="number" id="graduationYear" name="graduationYear" class="form-control" required min="1950" max="2035" value="${user.graduationYear}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="department">Bölüm / Fakülte *</label>
              <input type="text" id="department" name="department" class="form-control" required value="${user.department}">
            </div>

            <div class="form-group">
              <label class="form-label" for="company">Mevcut Şirket / Pozisyon</label>
              <input type="text" id="company" name="company" class="form-control" value="${user.company || ""}">
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary" style="flex: 1;">🔄 Değişiklikleri Güncelle</button>
              <a href="/users/${user.id}" class="btn btn-secondary">İptal</a>
            </div>
          </form>
        </div>
      </div>
    `;

    return renderLayout(content, {
      title: `Düzenle: ${user.name}`,
      activeNav: "users",
      alert: errorMessage ? { type: "error", message: errorMessage } : undefined,
    });
  }
}
