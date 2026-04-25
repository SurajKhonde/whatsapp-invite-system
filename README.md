# MehFil – Reliable WhatsApp Invite System (Queue-Driven)

🧠 Why this system exists

A friend wanted to send engagement invites to a large number of guests via WhatsApp.

At first glance, this seems trivial:

select contacts
forward message

But when we think deeper, this breaks at scale:

❌ Problems with manual approach
no delivery tracking
high chance of missing contacts
no retry on failure
not scalable beyond small groups
cannot automate or reuse

This led to a deeper question:

How do real systems handle bulk communication reliably?

That question drove the design of this system.

💡 Core Idea

The system is not about “sending messages”.

It is about:

Reliable, scalable, and controlled message delivery


> **Goal**: Deliver WhatsApp invites **reliably at scale** under rate limits, failures, and privacy constraints.

---

## 0) Problem Framing (from first principles)

A naive solution (“loop over contacts and send”) fails when:

* **Throughput** exceeds provider limits (WhatsApp rate tiers)
* **Partial failures** occur (network/API errors)
* **Observability** is needed (per-recipient status)
* **Privacy** is required (PII like phone numbers)
* **Idempotency** matters (avoid duplicate sends)

**Design target**:

```text
At-least-once delivery per recipient,
no cross-recipient coupling,
bounded rate,
auditable status,
PII protected.
```

---

## 1) Non-Functional Requirements (NFRs)

* **Reliability**: individual failures must not cascade
* **Idempotency**: retries must not duplicate user-visible messages
* **Throughput control**: respect WhatsApp rate limits
* **Observability**: per-recipient status + metrics
* **Security**: PII encrypted at rest, minimal exposure in transit/UI
* **Cost-aware**: single-node deploy initially, horizontally scalable later

---

## 2) Core Abstractions

* **Event**: user intent (e.g., “Engagement Invite”)
* **Recipient (event_guest)**: unit of work (one message to one person)
* **Job**: execution unit mapped 1:1 with `event_guest`
* **Worker**: stateless processor consuming jobs
* **Queue**: durability + retries + backoff

> **Invariant**: *One recipient = one job = one status row*

---

## 3) Architecture(Mid-Level Design)

This system is designed as a layered, decoupled architecture where each layer has a clear responsibility.

🧱 High-Level Components
                ┌──────────────────────┐
                │     Frontend         │
                │     (Next.js)        │
                └─────────┬────────────┘
                          │ HTTP
                          ▼
                ┌──────────────────────┐
                │   API Layer          │
                │   (Express Server)   │
                └─────────┬────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Auth Layer   │  │ Business     │  │ Rate Limiter │
│ (JWT + OTP)  │  │ Logic        │  │ (Abuse Ctrl) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └──────────┬──────┴──────┬──────────┘
                  ▼             ▼
         ┌────────────────────────────┐
         │       Database             │
         │   PostgreSQL (Encrypted)   │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │        Queue Layer         │
         │     (BullMQ + Redis)       │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │       Worker Layer         │
         │  (Concurrent Consumers)    │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │ External Service           │
         │ WhatsApp Cloud API         │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │ Status Persistence         │
         │ (event_guests table)       │
         └────────────────────────────┘

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
