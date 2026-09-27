# 🎓 Alumni Tracking System

A modern, comprehensive web platform designed for universities (such as Istanbul University) and educational academies to maintain strong, lifelong connections with their graduates. This system centralizes career tracking, mentorship programs, job postings, and detailed institutional statistics under one roof.

---

## 🚀 Key Features & Modules

- **👤 Comprehensive Alumni Profiles**:
  - Current company, position, industry, and skillset.
  - Academic history (graduation year, faculty, department, and degree).
  - LinkedIn, GitHub, and personal portfolio integrations.
- **🔍 Smart Search & Filtering**: Quickly discover alumni by location, graduation year, industry, or current employer.
- **🤝 Mentorship & Career Network**: A built-in infrastructure connecting current students with experienced industry alumni, featuring in-app messaging and meeting requests.
- **💼 Job & Internship Portal**: An exclusive job board for the alumni network to share internal or external career opportunities.
- **📅 Event & Organization Management**: Seamless scheduling for alumni reunions and seminars, complete with RSVP tracking.
- **📊 Admin & Statistics Dashboard**: Powerful tools for institution administrators to track employment rates, view industry distribution charts, and manage user verification workflows.
- **🌙 Modern UI (Dark/Light Mode)**: Highly responsive, personalized theme support for an enhanced user experience.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Node.js (Express + TypeScript) | High-performance, secure RESTful API with modular architecture. |
| **Database** | PostgreSQL | Robust relational database for storing alumni, event, and career data. |
| **ORM** | Prisma | Type-safe database client that automates schema migrations. |
| **Frontend** | Next.js 14/15 / React (TypeScript) | Responsive, modern web interface with Server-Side Rendering (SSR). |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first styling with full Dark/Light theme switching. |
| **Containerization** | Docker & Docker Compose | Multi-container architecture ensuring consistent dev & prod environments. |

---

## 📁 Project Directory Structure

```plaintext
Alumni-Tracking-System/
├── docker-compose.yml       # Container orchestration configuration
├── .env.example             # Sample environment variables
├── .env                     # Local environment variables
├── client/                  # Frontend (Next.js)
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app/             # Application pages and routing
│   │   ├── components/      # Reusable UI components
│   │   └── styles/          # Global and modular styles
│   └── tsconfig.json
├── server/                  # Backend (Node.js)
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/              # Database schema and migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Core business logic
│   │   ├── routes/          # API endpoints
│   │   └── middlewares/     # Authentication and error handling
│   └── tsconfig.json
└── README.md
```

---

## 🐳 Docker Setup & Quick Start

### Prerequisites
Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop) is installed and running.

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Start Services with Docker Compose
```bash
docker compose up --build
```

### 3. Access Services
- **Web Application (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **API Server (Backend)**: [http://localhost:5001/api](http://localhost:5001/api)
- **Database (PostgreSQL)**: `localhost:5432`

---

## 🗺️ Development Roadmap

- [x] **Phase 1: Architecture & Environment Setup**
  - Establish client and server directory structures.
  - Configure `docker-compose.yml` for Node.js and PostgreSQL.
  - Integrate Prisma ORM and execute initial database schema migrations.
- [ ] **Phase 2: Core API & Authentication**
  - JWT-based user registration and login workflows (with role-based authorization).
  - Foundational CRUD operations for alumni profiles and career histories.
- [ ] **Phase 3: Frontend Development (UI/UX)**
  - Responsive dashboard featuring toggleable Dark/Light theme.
  - Searchable and filterable alumni directory interface.
- [ ] **Phase 4: Social Modules & Career Board**
  - Job posting module and mentorship request workflows.
  - Event creation and RSVP tracking infrastructure.
- [ ] **Phase 5: Deployment & CI/CD**
  - Production-ready Docker images.
  - Automated testing and GitHub Actions CI/CD workflows.
