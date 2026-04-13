# 🚀 WhatsApp Invite System (Async Scalable Architecture)

A scalable invitation system built with **Next.js, BullMQ, Redis, and PostgreSQL** that handles bulk messaging using background workers and queue-based processing.

---

## 🧠 Problem Statement

Sending messages to multiple users (100–1000+) directly from an API leads to:

* ❌ Slow responses
* ❌ API timeouts
* ❌ Rate limiting issues
* ❌ Poor user experience

👉 This project solves it using **asynchronous job processing**.

---

## 🏗️ Architecture

```
Client (Next.js UI)
        ↓
Next.js API (enqueue jobs)
        ↓
Redis (BullMQ Queue)
        ↓
Worker Service (Node.js)
        ↓
External API (Gupshup / WhatsApp)
        ↓
PostgreSQL (status tracking)
```

---

## ⚙️ Tech Stack

* **Frontend**: Next.js (App Router)
* **Backend**: Next.js API routes
* **Queue**: BullMQ
* **Cache / Broker**: Redis
* **Database**: PostgreSQL (Prisma ORM)
* **Worker**: Node.js (separate process)
* **Auth**: OTP-based authentication
* **Deployment (planned)**:

  * Vercel (Frontend)
  * AWS EC2 (Worker)
  * EC2 (Redis)
  * Neon / Supabase (Postgres)

---

## 🔥 Features

### ✅ Authentication

* OTP-based signup/login flow

### ✅ Queue-Based Processing

* Jobs are added to Redis queue
* Worker processes jobs asynchronously

### ✅ Scalable Worker System

* Configurable concurrency
* Handles high-volume job bursts

### ✅ Status Tracking

Each invite has a state:

* `PENDING`
* `SENT`
* `FAILED`

### ✅ Retry Mechanism

* Failed jobs can be retried with backoff strategy

---

## 📦 Project Structure

```
apps/
  web/        → Next.js app (UI + API)
  worker/     → Background job processor

packages/
  db/         → Prisma client
  queue/      → BullMQ setup
  types/      → Shared types
```

---

## 🚀 Getting Started

### 1. Clone repo

```
git clone https://github.com/SurajKhonde/whatsapp-invite-system.git
cd whatsapp-invite-system
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Start Docker (Redis + Postgres)

```
docker-compose up -d
```

---

### 4. Run Prisma migrations

```
npx prisma migrate dev
```

---

### 5. Start Next.js app

```
cd apps/web
npm run dev
```

---

### 6. Start Worker

```
cd apps/worker
npx ts-node src/worker.ts
```

---

## 🧪 API Example

### Send invites

```
POST /api/send
```

```json
{
  "guests": [
    { "name": "Suraj", "phone": "9999999999" },
    { "name": "Rahul", "phone": "8888888888" }
  ]
}
```

---

## 📊 How It Works

1. User submits guest list
2. API stores data in DB
3. Jobs are pushed to Redis queue
4. Worker consumes jobs
5. Sends message via external API
6. Updates status in DB

---

## 📈 Future Improvements

* [ ] Campaign dashboard (progress tracking)
* [ ] Rate limiting (Gupshup safe)
* [ ] CSV upload support
* [ ] Real-time status updates (WebSocket)
* [ ] Dead letter queue (failed jobs)
* [ ] Admin analytics panel

---

## 🧠 What I Learned

* Difference between request-response vs async systems
* Why queues are essential for scalability
* Handling concurrency in distributed systems
* Designing fault-tolerant systems with retries
* Separation of concerns (API vs Worker)

---

## 💡 Key Insight

> This is not just a messaging system —
> it is a **distributed job processing system with state tracking**

---

## 👨‍💻 Author

**Suraj Khonde**

* Backend-focused full-stack developer
* Interested in scalable systems & real-world architecture

---

## ⭐ If you found this useful

Give it a star ⭐ and feel free to contribute!
