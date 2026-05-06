# pilooopu — Bulk Personalized WhatsApp Invite Platform

> Send 1000 personalized WhatsApp invites reliably, with delivery tracking, PII protection, and zero message loss — built for weddings, birthdays, and business events in India.

![Stack](https://img.shields.io/badge/Node.js-Express-green?style=flat-square)
![Queue](https://img.shields.io/badge/Queue-BullMQ%20%2B%20Redis-red?style=flat-square)
![DB](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Drizzle-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=flat-square)

---

## The Problem

Every wedding season in India, thousands of people manually forward the same WhatsApp message to hundreds of contacts, one by one.

The problems are obvious once you try it at scale:

- No delivery tracking — did everyone actually receive it?
- If WhatsApp cuts off mid-send, you don't know where it stopped
- Every guest gets the same generic message — no personalization
- No retry if a message fails — some guests are silently missed
- Phone numbers of all your guests sitting in plain text

pilooopu solves this. Upload your guest list, pick a template, and every guest receives a **personalized invite with their name** — reliably, with full delivery tracking, retries on failure, and all phone numbers encrypted at rest.

---

## What It Does

```
User uploads guest list (CSV or manual)
    ↓
Selects a template (birthday, wedding, business event)
    ↓
System generates a personalized image per guest (their name on the card)
    ↓
Each invite is queued as an independent job
    ↓
Worker decrypts phone number, sends WhatsApp message with personalized image
    ↓
Dashboard shows real-time status: sent / failed / pending per guest
    ↓
Failed jobs retry automatically with exponential backoff
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                   │
│   (Event creation · Guest management · Dashboard)    │
└────────────────────────┬────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────┐
│              Express API (Node.js / TypeScript)       │
│   Auth · Rate Limiting · Validation · Controllers    │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
┌──────▼──────┐          ┌────────▼────────┐
│ PostgreSQL  │          │   BullMQ Queue  │
│  (Drizzle)  │          │    (Redis)      │
│             │          │ 5 retries       │
│ users       │          │ exponential     │
│ guests      │          │ backoff         │
│ events      │          │ DLQ on failure  │
│ event_guests│          └────────┬────────┘
└─────────────┘                   │
                         ┌────────▼────────────────────┐
                         │     Invite Worker            │
                         │  concurrency: 5              │
                         │  1. Fetch job (eventGuestId) │
                         │  2. Decrypt phone (AES-256)  │
                         │  3. Generate image           │
                         │     (Puppeteer → PNG)        │
                         │  4. Send WhatsApp message    │
                         │  5. Update DB status         │
                         └────────┬────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │ WhatsApp Cloud  │
                         │     API         │
                         │ (Meta Business) │
                         └─────────────────┘
```

### Key Design Decisions

**Why one job per guest?**
Failure isolation. If 1 guest fails, the other 999 continue unaffected. Each job has its own retry counter, status row, and error log.

**Why async queue instead of direct loop?**
A synchronous loop blocks the API, has no retry on failure, and can't be monitored. The queue gives you backpressure control, retry, observability, and the ability to scale workers independently.

**Why encrypt phone numbers?**
Your guests' phone numbers are PII. pilooopu encrypts every phone number with AES-256-CBC (unique IV per number) before storing. The plaintext is only available inside the worker at send-time, never in API responses or logs.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| API | Node.js + Express + TypeScript | Async-first, typed, familiar ecosystem |
| Frontend | Next.js 14 + Redux Toolkit | SSR, RTK Query for data fetching |
| Queue | BullMQ + Redis | Battle-tested, retry/backoff built-in, Bull Board UI |
| Database | PostgreSQL + Drizzle ORM | Relational integrity, type-safe schema |
| Image Gen | Puppeteer (HTML → PNG) | Full CSS rendering, custom fonts, rich templates |
| Auth | JWT + bcrypt + Email OTP | Stateless, secure, OTP via queue (not sync) |
| Payments | Razorpay | India-first, UPI support |
| Security | AES-256-CBC encryption | Phone numbers encrypted at rest |
| DevOps | Docker Compose, PM2 | Single-node MVP, scale to multi-worker later |

---

## Database Schema

### `guests`
```sql
id          UUID PRIMARY KEY
host_id     UUID → users (cascade delete)
name        TEXT NOT NULL
phone       TEXT NOT NULL          -- AES-256 encrypted
phone_last4 TEXT                   -- for masked display only
relation    TEXT DEFAULT 'friend'
invite_count INTEGER DEFAULT 0
created_at  TIMESTAMP
```

### `events`
```sql
id           UUID PRIMARY KEY
user_id      UUID → users
template_id  UUID → templates
event_type   TEXT                  -- 'birthday' | 'wedding' | 'business'
total_guests INTEGER
status       TEXT                  -- 'processing' | 'completed'
created_at   TIMESTAMP
```

### `event_guests` ← the delivery truth table
```sql
id              UUID PRIMARY KEY
event_id        UUID → events (cascade delete)
guest_id        UUID → guests (cascade delete)
status          TEXT DEFAULT 'pending'  -- pending | sent | failed
attempts        INTEGER DEFAULT 0
last_attempt_at TIMESTAMP
delivered_at    TIMESTAMP
error_message   TEXT
```

> **Invariant:** `(event_id, guest_id)` is unique. One guest, one job, one status row per event. Counts (sent/failed) are always derived with `COUNT(*) FILTER` — never stored — to prevent drift.

---

## Security Model

```
Phone numbers in DB:   AES-256-CBC encrypted (unique IV per number)
Phone in API response: Masked  (+91*****1234)
Phone in worker:       Decrypted only at send-time, never logged
Phone in queue:        Never stored — only guest UUID travels in job payload
Access control:        All queries scoped by user_id
```

This means even if your database is leaked, phone numbers are not readable without the encryption key.

---

## Project Structure

```
pilooopu/
├── apps/
│   ├── backend/                    # Express API
│   │   └── src/
│   │       ├── core/
│   │       │   ├── errors/         # AppError, global error handler
│   │       │   ├── queue/          # BullMQ queue definitions
│   │       │   └── worker/         # BullMQ workers
│   │       ├── db/
│   │       │   └── schema/         # Drizzle schema definitions
│   │       ├── modules/
│   │       │   ├── auth/           # Signup, login, OTP, JWT
│   │       │   ├── campaign/       # Event creation and management
│   │       │   ├── guest/          # Guest CRUD, bulk insert, encryption
│   │       │   ├── invite/         # Image generation (Puppeteer)
│   │       │   ├── payment/        # Razorpay integration
│   │       │   ├── template/       # Template management + cache
│   │       │   └── whatsapp/       # WhatsApp Cloud API integration
│   │       └── utils/
│   │           ├── encrptContact.ts  # AES-256 encrypt/decrypt
│   │           ├── generateImage.ts  # Puppeteer HTML → PNG
│   │           └── templateEngine.ts # {{variable}} HTML renderer
│   └── web/                        # Next.js 14 frontend
│       ├── app/                    # App router pages
│       ├── components/             # Dashboard, GuestForm, GuestList
│       └── Store/                  # Redux Toolkit + RTK Query
├── packages/
│   ├── db/                         # Shared DB client
│   └── queue/                      # Shared queue config
└── docker-compose.yml              # PostgreSQL + Redis + pgAdmin
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker + Docker Compose
- Meta Business WhatsApp Cloud API credentials

### 1. Clone and install

```bash
git clone https://github.com/SurajKhonde/whatsapp-invite-system.git
cd whatsapp-invite-system
pnpm install
```

### 2. Start infrastructure

```bash
docker-compose up -d
# Starts: PostgreSQL (5432), Redis (6379), pgAdmin (5050)
```

### 3. Configure environment

```bash
cp apps/backend/.env.example apps/backend/.env
```

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/invite_db

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_secret_here
ENCRYPTION_KEY=your_32_char_key_here

# WhatsApp Cloud API
WHATSAPP_TOKEN=your_meta_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
WHATSAPP_API_URL=https://graph.facebook.com/v19.0

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# Payments
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### 4. Run database migrations

```bash
cd apps/backend
pnpm drizzle-kit push
```

### 5. Start development

```bash
# From root
pnpm dev
```

- API: http://localhost:5000
- Frontend: http://localhost:3000
- Bull Board (queue monitor): http://localhost:5000/admin/queues
- pgAdmin: http://localhost:5050

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register + send OTP |
| POST | `/api/auth/verify` | Verify OTP |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset OTP |
| POST | `/api/auth/resend-otp` | Resend OTP |
| POST | `/api/auth/reset-password` | Set new password |

### Guests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/guests` | Add guests (bulk) |
| GET | `/api/guests` | List guests (phone masked) |
| POST | `/api/contacts/upload` | CSV upload |

### Events (Campaigns)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/campaign` | Create event + queue all invites |
| GET | `/api/campaign` | List events with sent/failed counts |
| GET | `/api/campaign/:id` | Event details + per-guest status |

### Invites
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/invite/preview` | Generate preview image for template |

---

## Worker Lifecycle

For each guest in an event, a job is created in BullMQ:

```
Job payload: { eventId, eventGuestId, userId }

Worker steps:
  1. SELECT event_guest WHERE id = eventGuestId
  2. If status === 'sent' → skip (idempotent)
  3. Decrypt phone number (AES-256)
  4. Send WhatsApp message with personalized image
  5. On success → UPDATE status='sent', delivered_at=now(), attempts++
  6. On failure → UPDATE status='failed', error_message, attempts++
               → throw error → BullMQ handles retry
```

**Retry config:**
- Max attempts: 5
- Backoff: exponential starting at 2 seconds (2s → 4s → 8s → 16s → 32s)
- Failed jobs are kept in Redis for inspection (not auto-deleted)

---

## Image Generation Pipeline

```
Guest data (name, event details)
    ↓
templateEngine.ts — injects {{name}}, {{date}}, {{venue}} into HTML
    ↓
generateImage.ts — Puppeteer renders HTML to PNG (800×1100px)
    ↓
saveLocalImage.ts — saves to /public/generated/invite-{uuid}.png
    ↓
[Roadmap] — upload to S3, attach as media in WhatsApp message
```

Templates are pure HTML/CSS files. To add a new template, create an HTML file with `{{variable}}` placeholders and register it in the template table.

---

## Roadmap

### In Progress
- [ ] Wire generated image to WhatsApp media message
- [ ] CSV guest list upload with validation
- [ ] Razorpay payment integration (per-event pricing)

### Planned
- [ ] Puppeteer browser pool (replace per-request launch)
- [ ] Webhook ingestion for delivery receipts from WhatsApp
- [ ] WebSocket live dashboard (replace polling)
- [ ] Dead-letter queue UI for manual job re-drive
- [ ] Scheduled sends (send at a specific date/time)
- [ ] Wedding / corporate event templates
- [ ] Multi-language support (Hindi, Kannada, Tamil)
- [ ] WhatsApp opt-in flow (for compliance)

---

## Local Development Tips

**View queues:** http://localhost:5000/admin/queues (Bull Board) — see pending, active, failed jobs in real time.

**View database:** http://localhost:5050 (pgAdmin) — login with `admin@example.com` / `admin`.

**Test WhatsApp sending:** Start with the sandbox number Meta provides — no template approval needed for test messages.

**Add a new template:** Create `src/modules/template/{name}/{name}.html` with `{{guestName}}`, `{{eventDate}}`, `{{venue}}` placeholders. Run Puppeteer preview to check rendering before adding to the DB.

---

## Contributing

This project is in active development. Contributions welcome.

1. Fork the repo
2. Create your branch: `git checkout -b feat/your-feature`
3. Commit with clear messages: `feat: add CSV bulk upload`, `fix: puppeteer browser pool`
4. Open a PR with description of what you built and why

Areas especially needing help: frontend design, template library, WhatsApp webhook handling.

---

## Author

**Suraj Khonde** — Full Stack Engineer specializing in real-time systems and event-driven architecture.

[GitHub](https://github.com/SurajKhonde) · [LinkedIn](https://linkedin.com/in/surajkhonde) · [Portfolio](https://surajkhonde.dev) · [Medium](https://medium.com/@surajkhonde)

---

## License

MIT — use it, fork it, build on it.