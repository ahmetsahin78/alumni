/**
 * ============================================================================
 * Base HTML Layout Component (MVC View Katmanı)
 * ============================================================================
 * Express sunucu taraflı HTML görünümleri (Server-Side Rendered Views)
 * için ortak, modern ve responsive responsive sayfa şablonu.
 * ============================================================================
 */

export interface LayoutOptions {
  title: string;
  activeNav?: "home" | "users" | "announcements" | "docs";
  alert?: {
    type: "success" | "error" | "info" | "warning";
    message: string;
  };
}

export function renderLayout(content: string, options: LayoutOptions): string {
  const { title, activeNav, alert } = options;

  const alertHtml = alert
    ? `
      <div class="alert alert-${alert.type}">
        <span class="alert-icon">${
          alert.type === "success"
            ? "✅"
            : alert.type === "error"
            ? "⚠️"
            : alert.type === "warning"
            ? "🔔"
            : "ℹ️"
        }</span>
        <div>${alert.message}</div>
      </div>
    `
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Alumni Tracking System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #eff6ff;
      --secondary: #475569;
      --success: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      --dark: #0f172a;
      --card-bg: #ffffff;
      --bg: #f8fafc;
      --border: #e2e8f0;
      --text: #1e293b;
      --text-muted: #64748b;
      --radius: 12px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    .navbar {
      background: #ffffff;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--dark);
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }

    .brand-badge {
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      padding: 0.35rem 0.6rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
    }

    .nav-link {
      text-decoration: none;
      color: var(--secondary);
      font-weight: 600;
      font-size: 0.92rem;
      padding: 0.5rem 0.85rem;
      border-radius: 8px;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .nav-link:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-link.active {
      background: var(--primary);
      color: #ffffff;
    }

    /* Main Container */
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      flex: 1;
      width: 100%;
    }

    /* Alerts */
    .alert {
      padding: 1rem 1.25rem;
      border-radius: var(--radius);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      font-size: 0.95rem;
      box-shadow: var(--shadow-sm);
    }
    .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .alert-info { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      padding: 0.55rem 1.15rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary { background: #ffffff; color: var(--secondary); border-color: var(--border); }
    .btn-secondary:hover { background: #f1f5f9; color: var(--dark); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { background: #b91c1c; }
    .btn-sm { padding: 0.35rem 0.65rem; font-size: 0.82rem; }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge-primary { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-danger { background: #fee2e2; color: #b91c1c; }
    .badge-neutral { background: #f1f5f9; color: #475569; }

    /* Cards */
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
      margin-bottom: 1.5rem;
    }
    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .card-body {
      padding: 1.5rem;
    }

    /* Forms */
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 0.4rem;
    }
    .form-control {
      width: 100%;
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.92rem;
      font-family: inherit;
      color: var(--text);
      background: #ffffff;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    textarea.form-control {
      min-height: 120px;
      resize: vertical;
    }

    /* Tables */
    .table-responsive {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--secondary);
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .data-table td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid var(--border);
      font-size: 0.9rem;
      color: var(--text);
    }
    .data-table tr:hover td {
      background: #f8fafc;
    }

    /* Footer */
    .footer {
      background: #ffffff;
      border-top: 1px solid var(--border);
      padding: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: auto;
    }
    .footer a {
      color: var(--primary);
      text-decoration: none;
    }

    @media (max-width: 768px) {
      .nav-container { flex-direction: column; align-items: stretch; }
      .nav-links { flex-wrap: wrap; justify-content: center; }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="/" class="brand">
        <span class="brand-badge">🎓 ATS</span>
        <span>Alumni Tracking System</span>
      </a>
      <ul class="nav-links">
        <li><a href="/" class="nav-link ${activeNav === "home" ? "active" : ""}">🏠 Ana Sayfa</a></li>
        <li><a href="/users" class="nav-link ${activeNav === "users" ? "active" : ""}">👤 Kullanıcılar (View)</a></li>
        <li><a href="/announcements" class="nav-link ${activeNav === "announcements" ? "active" : ""}">📢 Duyurular (Homework UI)</a></li>
        <li><a href="/api/swagger" class="nav-link ${activeNav === "docs" ? "active" : ""}" target="_blank">📖 Swagger Docs</a></li>
        <li><a href="/api/health" class="nav-link" target="_blank">💚 Sağlık</a></li>
      </ul>
    </div>
  </nav>

  <main class="container">
    ${alertHtml}
    ${content}
  </main>

  <footer class="footer">
    <p>İstanbul Üniversitesi Web Programlama Dersi &copy; 2026 | <strong>Assoc. Prof. Dr. Emre Akadal</strong></p>
    <p style="margin-top: 0.25rem;">Hafta 04: In-Memory MVC Mimarisi (User & Announcement Modülleri)</p>
  </footer>
</body>
</html>`;
}

