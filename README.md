# 🚀 MehFil – Reliable WhatsApp Invite System (Queue-Driven)

> Send WhatsApp invites at scale — **reliably, securely, and asynchronously**

---

## 🧠 Why this system exists

A real problem triggered this project.

A friend needed to send engagement invites to many people via WhatsApp.

At first, it seems simple:

* Select contacts
* Forward message

But this breaks quickly at scale.

### ❌ Problems with manual approach

* No delivery tracking
* High chance of missing contacts
* No retry on failure
* Not scalable beyond small groups
* Cannot automate or reuse

This led to a key question:

> **How do real systems handle bulk communication reliably?**

---

## 💡 Core Idea

This system is **not about sending messages**.

It is about:

```text
Reliable, scalable, and controlled message delivery
```

---

## 🎯 Goal

> Deliver WhatsApp invites **reliably at scale** under:

* rate limits
* failures
* privacy constraints

---

# 🧩 0) Problem Framing (First Principles)

A naive solution:

```text
loop → send → done
```

Fails due to:

* **Throughput limits** → WhatsApp rate limits
* **Partial failures** → network/API errors
* **Lack of observability** → no per-user tracking
* **Privacy risks** → phone numbers exposure
* **Idempotency issues** → duplicate messages

### ✅ Design Target

```text
At-least-once delivery per recipient
No cross-recipient coupling
Bounded rate
Auditable status
PII protected
```

---

# ⚙️ 1) Non-Functional Requirements

* **Reliability** → failures must not cascade
* **Idempotency** → retries must not duplicate sends
* **Rate control** → respect API limits
* **Observability** → track per-recipient status
* **Security** → encrypt sensitive data
* **Cost efficiency** → single-node deployment initially

---

# 🧱 2) Core Abstractions

* **Event** → user intent (e.g., engagement invite)
* **Recipient (event_guest)** → unit of work
* **Job** → execution unit (1:1 with recipient)
* **Worker** → processes jobs
* **Queue** → manages retries + execution

> ⚠️ **Invariant**
> One recipient = one job = one status row

---

# 🏗️ 3) Architecture (Mid-Level Design)

### 🔹 High-Level Flow

```text
Frontend (Next.js)
        ↓
API Layer (Express)
        ↓
Auth + Rate Limit
        ↓
Business Logic
        ↓
PostgreSQL (Encrypted)
        ↓
Queue (BullMQ + Redis)
        ↓
Worker (Parallel Processing)
        ↓
WhatsApp API
        ↓
Status Update (event_guests)
```

---

### 🔹 Key Design Principle

```text
Synchronous → user intent
Asynchronous → execution
```

* API responds fast
* heavy work happens in background

---

### 🔹 Why Queue is Critical

❌ Without queue:

```text
API → loop → send
```

Problems:

* blocking
* failures stop everything
* no retries

✅ With queue:

```text
API → enqueue → worker
```

Benefits:

* scalable
* reliable
* fault isolated

---

## 4) Data Model (source of truth)

### `events`

* `id, user_id, template_id, event_type`
* metadata only (NOT delivery truth)

### `event_guests` (**truth**)

* `id, event_id, guest_id`
* `status`: `pending | sent | failed`
* `attempts, last_attempt_at, delivered_at, error_message`
* **Unique constraint**: `(event_id, guest_id)` → prevents duplicates

> **Derived counts** (never stored to avoid drift):

```sql
COUNT(*) FILTER (WHERE status='sent')
COUNT(*) FILTER (WHERE status='failed')
```

---

## 5) PII & Security Model

* **At rest**: `guests.phone` encrypted (e.g., AES)
* **In use**: decrypted only inside worker at send-time
* **In UI**: masked (`+91*****1234`)
* **Access control**: all queries scoped by `user_id`

> **Threat model**: prevent enumeration of others’ contacts + accidental leaks

---

## 6) Job Design & Idempotency

### Why 1 job per recipient?

* failure isolation
* granular retries
* precise metrics
* controlled parallelism

### Idempotency strategy

* **Primary key**: `event_guests.id`
* Worker checks current `status`:

  * if already `sent` → **no-op**
* Optionally include **idempotency key** in outbound call metadata (if provider supports)

---

## 7) Worker Lifecycle (per job)

```text
Fetch job(eventGuestId, userId)
  → SELECT event_guest
  → if status == 'sent' → exit (idempotent)
  → decrypt phone (via service)
  → call WhatsApp template API
  → on success:
        UPDATE status='sent', delivered_at=now(), attempts++
  → on failure:
        UPDATE status='failed', error, attempts++, last_attempt_at
        throw → queue handles retry (backoff)
```

---

## 8) Retry & Backoff

* **Attempts**: e.g., 5
* **Backoff**: exponential (2s, 4s, 8s…)
* **Why**:

  * transient errors (network, 5xx)
  * provider throttling windows

> **Policy**: After max attempts → terminal `failed` (visible to user)

---

## 9) Rate Limiting Strategy

Two layers:

1. **Worker concurrency**:

```text
concurrency = 3–10 (tunable)
```

2. **Queue limiter (optional)**:

```text
max X jobs / duration Y
```

> Align with WhatsApp tier (e.g., 10 msg/sec).
> Prevent burst spikes → smoother throughput.

---

## 10) API Layer (key endpoints)

* `POST /auth/signup | /login | /verify-otp | /resend-otp`
* `POST /events` → creates event + `event_guests` + enqueues jobs
* `GET /events` → list with derived counts
* `GET /events/:id` → per-recipient status

**Rate limiting**:

* OTP endpoints throttled (prevent abuse)
* Event creation throttled per user

---

## 11) WhatsApp Integration Constraints

* **Template-only** messaging
* **Pre-approved** templates
* **Variables mapping** (body params)
* **Phone format**: E.164 without `+` for API payloads

**Failure classes**:

* 4xx (validation/template issues) → usually non-retryable
* 5xx/network → retryable

---

## 12) Consistency Model

* **Eventual consistency** between UI and worker updates
* UI uses **polling** (e.g., 2–3s) to fetch status
* Strong consistency not required; correctness comes from DB truth

---

## 13) Observability (minimum viable)

* Logs:

  * job start/end
  * API responses (sanitized)
  * errors with codes
* Metrics (future):

  * success rate
  * retries per job
  * latency per send

---

## 14) Failure Modes & Handling

| Failure       | Handling                    |
| ------------- | --------------------------- |
| Network error | retry with backoff          |
| WhatsApp 4xx  | mark failed (no retry)      |
| Worker crash  | job re-queued by BullMQ     |
| Duplicate job | idempotent check via status |
| DB outage     | job fails → retry later     |

---

## 15) Deployment Model (cost-aware)

Single VPS (2GB RAM):

```text
Docker Compose
├── app (API + Next.js)
├── worker
├── postgres
├── redis
├── nginx (reverse proxy)
```

* Scale later by adding more **worker replicas**
* No need for managed services at MVP stage

---

## 16) Trade-offs

**Chosen**

* Queue-based async processing (complex but reliable)
* Derived counts (correctness over write-time convenience)

**Avoided**

* synchronous bulk send (simple but fragile)
* storing counters (risk of drift)

---

## 17) Future Extensions

* **Webhook ingestion** (delivered/read receipts)
* **Dead-letter queue** (manual re-drive)
* **Scheduling** (send at time T)
* **Multi-tenant isolation** (per-tenant limits)
* **Payments** (quota-based usage)
* **WebSockets** (replace polling when needed)

---

## 18) Key Invariants (what must always hold)

* Each `(event_id, guest_id)` appears **once**
* A job **never** sends twice after `status='sent'`
* PII is **never** exposed in plaintext outside worker boundary
* Counts in UI are **derived**, not stored

---

## 19) What this demonstrates

* async system design under real constraints
* idempotency + retry strategies
* secure handling of sensitive data
* external API integration with backpressure control

---

## 👨‍💻 Author

Suraj Khonde
