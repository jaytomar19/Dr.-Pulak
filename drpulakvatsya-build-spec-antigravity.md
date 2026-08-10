# drpulakvatsya.com — Full Build Specification (Implementation-Ready)
**For:** AI development agent / build tool
**Client:** Dr. Pulak Vatsya, Orthopaedic Surgeon — StepUp Joints, Lajpat Nagar, New Delhi
**Document type:** Implementation spec — architecture, data model, page inventory, API contracts, config schemas, environment setup, build order
**Status:** Ready to build against. §7 (assessment question content) ships as a placeholder-safe config until the client supplies real content — build the engine, not fake clinical copy.

---

## 1. Project Summary

A mobile-first, bilingual (English + Hindi top 10 pages) medical practice website functioning as a **patient-acquisition funnel**, not a brochure site. Core loop:

```
Video/social traffic → dedicated landing page → free "knee check" assessment
→ contact captured → segmented result (band A/B/C/R) → booking + payment → consultation
```

Hard rule: campaign traffic never lands on the homepage. Every landing page's only job is to start the assessment.

---

## 2. Recommended Stack

| Layer | Choice | Notes |
|---|---|---|
| CMS/Frontend | WordPress (headless not required) OR Next.js + headless CMS | WordPress preferred per client ask for SEO control + editability; if Next.js, pair with a CMS the client can self-edit (e.g. Sanity, WordPress headless) |
| Assessment app | Standalone React/Next.js micro-app embedded at `/knee-check/` | Keeps scoring logic decoupled from CMS theme; served as an iframe-free embedded component, not a full page reload between questions |
| Database | Postgres (assessment sessions, leads, consent records) | CMS DB (MySQL, if WordPress) stays separate from patient/lead data store |
| Booking | Cal.com (self-hostable, API-first) or Calendly API | Needs timezone-aware slots + buffers + blackout dates + webhook on booking events |
| Payments | Razorpay | UPI, cards, netbanking, intl cards; webhook-driven booking confirmation |
| WhatsApp | Meta-approved BSP: AiSensy / Wati / Interakt | Template messages only pre-approval; session messages after |
| Email | Transactional provider (e.g. SendGrid, Postmark) | Needed for delivery-status tracking (queued/sent/delivered/failed) |
| CRM | Zoho CRM or HubSpot | All leads + assessment data land here; source of truth for follow-up status |
| Automation/orchestration | Make.com (or n8n if self-hosted preferred) | Connects CRM ↔ WhatsApp ↔ Email ↔ Booking webhooks |
| Analytics | GA4 + Microsoft Clarity | GA4 events per §10; Clarity on landing pages + assessment only |
| File storage (imaging) | S3-compatible bucket, private, signed URLs | Not Phase 1 MVP — see §13 |
| Hosting | Any Indian-region-capable host (data residency requirement) | Confirm CDN edge/cache doesn't leak India-resident PII outside India |

**Architecture principle:** the assessment app, the CRM/lead pipeline, and the marketing site (WordPress/Next.js) are three separable concerns talking over defined APIs/webhooks — this keeps the scoring config editable without a redeploy of the whole site, and keeps lead PII out of the CMS database entirely.

---

## 3. Repository / Folder Structure (suggested)

```
/site                        # WordPress theme or Next.js marketing site
  /templates
    homepage.tsx
    condition-hub.tsx
    video-landing.tsx
    article.tsx
    locality.tsx
    consult-overview.tsx
  /components
    AssessmentCTA.tsx
    GoogleReviewsWidget.tsx
    YouTubeEmbed.tsx
    CredentialsBlock.tsx
    StickyMobileCTA.tsx

/assessment-app               # standalone assessment micro-app
  /src
    /questions                # config-driven, NOT hardcoded
      questions.config.json
      scoring.config.json
      results.config.json     # copy for bands A/B/C/R
    /screens
      Intro.tsx
      Question.tsx            # generic renderer, driven by config
      ContactCapture.tsx
      Completion.tsx
      Result.tsx
    /state
      sessionMachine.ts        # state machine: start → Q1..Q9 → capture → result
    /api
      submitAssessment.ts
      submitContact.ts
      getResult.ts

/api                           # backend services
  /leads
    create.ts
    update-status.ts
  /assessment
    session.ts
    score.ts                  # reads scoring.config.json, never hardcodes thresholds
  /webhooks
    booking-confirmed.ts
    payment-confirmed.ts
    whatsapp-status.ts
    email-status.ts
  /consent
    record.ts

/config
  env.example
  scoring.config.json          # duplicated/synced with assessment-app for server-side validation

/docs
  handover.md
  data-retention-policy.md
```

---

## 4. Site Architecture / URL Map

```
/                                   Homepage
├── /knee-replacement/              Condition hub 1
│   ├── /robotic-knee-replacement/
│   ├── /partial-knee-replacement/
│   ├── /revision-knee-replacement/
│   ├── /recovery-timeline/
│   ├── /cost-in-delhi/
│   └── [8–12 supporting articles]
├── /acl/                           Condition hub 2
│   ├── /acl-surgery-vs-no-surgery/
│   ├── /acl-recovery-timeline/
│   ├── /return-to-sport/
│   └── [8–12 supporting articles]
├── /knee-pain/                     Condition hub 3
│   ├── /chondromalacia-patellae/
│   ├── /pain-going-down-stairs/
│   ├── /runners-knee/
│   └── [8–12 supporting articles]
├── /knee-check/                    Assessment — main entry
│   ├── /knee-check/result/         Dynamic result (A/B/C/R)
│   ├── /acl-check/                 Campaign variant (same engine, different intro copy)
│   └── /kneecap/                   Campaign variant
├── /consult/
│   ├── /consult/online/
│   ├── /consult/opd/
│   ├── /consult/imaging-review/
│   └── /consult/second-opinion/
├── /international-second-opinion/
├── /about/
├── /blog/
├── /knee-replacement-surgeon-south-delhi/   ×6 locality pages
├── /privacy-policy/
├── /terms/
└── /grievance/
```

Rules: lowercase-hyphenated, no dates/category prefixes on articles · Hindi at `/hi/[slug]/` with hreflang · campaign slugs short (spoken in videos) · no post-launch URL changes without 301s.

---

## 5. Page-by-Page Build Instructions

### 5.1 Homepage
**Route:** `/`
**Components:** Hero (statement + 2 equal-weight CTAs: Book / Take free knee check + location + phone) → `ConditionHubCards` (×3) → `CredentialsBlock` → `GoogleReviewsWidget` (live GBP pull) → `YouTubeRecentVideos` (dynamic channel pull) → `OnlineConsultExplainer` (links `/consult/online/`) → `LocationMapContact`
**Not for campaign traffic** — no ad UTMs should route here by design.

### 5.2 Condition Hub Template (×3 instances)
**Route pattern:** `/{condition}/`
**Structure:** H1 (patient language) → intro → TOC → sections (what/symptoms/diagnosis/treatment incl. non-surgical & watchful waiting/recovery/how to decide) → embedded YouTube → FAQ (FAQPage schema) → related articles → **AssessmentCTA ×3** (post-symptoms, post-treatment, end) → sticky mobile CTA bar
**Schema:** MedicalWebPage + FAQPage + BreadcrumbList

### 5.3 Video Landing Page Template (highest priority build)
**Route pattern:** `/{campaign-slug}/` e.g. `/knee-check/`, `/acl-check/`
**Above fold (mobile, zero scroll):** Dr. Vatsya photo matching video framing → H1 restating visitor's question → 1-sentence assessment explainer (90 sec) → single CTA button
**Nothing else above fold** — no nav, no phone, no credentials, no other links.
**Below fold:** embedded video → short credentials → 3 Google reviews → repeat CTA → legal-only footer
**Perf budget:** <500KB total, <2s render on 4G. No render-blocking scripts.

### 5.4 Assessment App — Detailed Spec
**Entry:** `/knee-check/` (and campaign variants `/acl-check/`, `/kneecap/` — same engine, swappable intro copy via config)

**Screen flow (state machine):**
```
INTRO → Q1 → Q2 → Q3 → Q4 → Q5 → Q6 → Q7 → Q8 → CONTACT_CAPTURE → Q9 → COMPLETION → RESULT
```
Note: contact capture sits between Q8 and Q9 per spec — confirm this exact placement with client since it's unusual (most funnels gate after the last question); if intentional, Q9 answers still feed scoring but are captured post-lead-creation.

**Requirements:**
- One question per screen, visible progress bar
- Back-navigation preserves answers (state persisted client-side + synced to session record server-side, so a refresh doesn't lose progress)
- Anonymous session created at `assessment_start` (no PII yet)
- Session ID carried through to lead record at contact capture (links anonymous behavior to identified lead)

**Question config schema** (`questions.config.json`):
```json
{
  "version": "1.0",
  "questions": [
    {
      "id": "q1",
      "order": 1,
      "type": "single_select",
      "prompt": "PLACEHOLDER — awaiting doctor-approved content",
      "options": [
        {"value": "PLACEHOLDER", "label": "PLACEHOLDER", "points": 0, "flags": []}
      ]
    }
  ]
}
```
**Do not populate `prompt`/`label` with invented clinical content.** Ship with explicit placeholders and a build-time check that blocks production deploy if any `PLACEHOLDER` string remains in `questions.config.json` once real content is supplied — this prevents fabricated clinical copy from silently reaching patients.

**Scoring config schema** (`scoring.config.json`):
```json
{
  "version": "1.0",
  "bands": {
    "A": {"min": 0, "max": 10},
    "B": {"min": 11, "max": 20},
    "C": {"min": 21, "max": 30}
  },
  "flag_overrides": [
    {
      "flag": "RED_FLAG_EXAMPLE",
      "forces_band": "R",
      "description": "PLACEHOLDER — doctor-defined red-flag criteria required"
    }
  ]
}
```
Server-side scoring service (`/api/assessment/score.ts`) reads this config — never hardcode point values or thresholds in application code.

**Result config schema** (`results.config.json`) — one entry per band (A/B/C/R), each with: summary template, possible-causes copy, recommended next step, which CTAs to show. **Band R:** `show_ctas: false`, `fire_internal_alert: true`, `exclude_from_automation: true`.

**Contact capture screen:**
Fields: Full Name, WhatsApp/Mobile, Email. Copy states plainly why the info is needed. Consent checkbox (unticked default) separate from any marketing-consent checkbox (also unticked, also separate).

**Result screen:**
Never renders definitive diagnosis language. Template strings only ("Your responses may be associated with...", "Some possible causes include...") pulled from `results.config.json`, never generated freeform by an LLM without the doctor-approved template as its ceiling.

---

## 6. Data Model

### `assessment_sessions`
| field | type | notes |
|---|---|---|
| session_id | uuid, pk | created at assessment_start, anonymous |
| started_at | timestamp | |
| campaign_source | string, nullable | UTM capture |
| answers | jsonb | question_id → answer value, appended as user progresses |
| band_result | enum(A,B,C,R), nullable | set after scoring |
| flags | jsonb | which flag_overrides triggered |
| completed_at | timestamp, nullable | |
| lead_id | uuid, fk, nullable | populated once contact captured |

### `leads`
| field | type | notes |
|---|---|---|
| lead_id | uuid, pk | |
| name | string | |
| phone | string, encrypted at rest | |
| email | string, encrypted at rest | |
| session_id | uuid, fk | links to assessment |
| source / landing_page / utm_* / referral | strings | |
| lead_status | enum | New / Contacted / Interested / Booked / Converted / Not Interested / No Response / Invalid / Closed |
| appointment_status | enum, nullable | |
| consultation_status | enum, nullable | |
| notes | text | |
| assigned_staff | string, nullable | |
| last_contacted_at | timestamp, nullable | |
| next_followup_at | timestamp, nullable | |
| created_at / updated_at | timestamp | |

### `consent_records`
| field | type | notes |
|---|---|---|
| consent_id | uuid, pk | |
| lead_id | uuid, fk | |
| consent_type | enum(service, marketing) | stored separately, never combined |
| consent_text_version | string | exact version shown to user |
| timestamp | timestamp | |
| ip_address | string | |
| granted | boolean | |

### `delivery_log`
| field | type | notes |
|---|---|---|
| id | uuid, pk | |
| lead_id | uuid, fk | |
| channel | enum(whatsapp, email) | |
| status | enum(queued, sent, delivered, failed) | polled/webhook-updated, never assumed from API-call success alone |
| attempted_at / updated_at | timestamp | |
| retry_count | int | |

### `bookings`
| field | type | notes |
|---|---|---|
| booking_id | uuid, pk | |
| lead_id | uuid, fk | |
| product | enum(opd, online_live, imaging_review, second_opinion) | |
| slot_datetime | timestamp, tz-aware | |
| payment_status | enum(pending, paid, refunded) | |
| payment_provider_ref | string | Razorpay transaction id |
| status | enum(confirmed, completed, no_show, cancelled, rescheduled) | |

**PII handling rule baked into schema:** `leads.phone` and `leads.email` are the only tables where raw PII sits — encrypted at rest. `assessment_sessions.answers` and `bookings` reference `lead_id`/`session_id`, never duplicate name/phone/email inline.

---

## 7. API Contracts (core endpoints)

```
POST /api/assessment/session
  → creates assessment_sessions row, returns session_id
  body: { campaign_source?, utm_* }

PATCH /api/assessment/session/:id
  → appends answer for current question
  body: { question_id, answer_value }

POST /api/leads
  → creates lead, links session_id, writes consent_records (service + marketing separately)
  body: { session_id, name, phone, email, consent_service: bool, consent_marketing: bool, consent_text_version }
  → triggers: CRM sync, scoring service call

POST /api/assessment/score
  → server-side only, reads scoring.config.json
  body: { session_id }
  → writes band_result + flags to assessment_sessions
  → if band === 'R': fires internal alert, marks lead excluded_from_automation = true

GET /api/assessment/result/:session_id
  → returns band-appropriate result copy from results.config.json
  → 403 if lead has not completed contact capture for this session

POST /api/webhooks/booking-confirmed
  → from Cal.com/Calendly, updates bookings + leads.lead_status, exits all nurture sequences

POST /api/webhooks/payment-confirmed
  → from Razorpay, updates bookings.payment_status

POST /api/webhooks/whatsapp-status
  → from BSP, updates delivery_log

POST /api/webhooks/email-status
  → from email provider, updates delivery_log
```

---

## 8. Booking & Payment Flow

| Product | Type | Payment |
|---|---|---|
| OPD, Lajpat Nagar | Calendar slot | Optional deposit |
| Online live | Calendar slot, tz-aware | Full, upfront |
| Imaging review | Async | Full, upfront |
| Second opinion | Async + calendar | Full, upfront |

- Max 3 clicks: result page → product select → slot/payment → confirmed
- Payment upfront on all online products (non-negotiable, controls no-shows)
- Geo default: Delhi NCR → OPD-first; elsewhere → online-first; both always reachable
- Booking confirmation → immediate WhatsApp + email + intake form send
- Reminders: T−24h, T−2h
- Self-service reschedule/cancel with configurable cutoff window
- On `booking_complete`: lead exits every active nurture sequence immediately (webhook-driven, not polled)

---

## 9. Automation Sequences

| # | Trigger | Cadence | Channel |
|---|---|---|---|
| 1. Abandoned assessment | `assessment_start` w/ no contact capture, +1hr | single message | WhatsApp → email fallback |
| 2. Captured, no booking | contact captured, no booking | days 2, 5, 9; content varies by band | WhatsApp → email fallback |
| 3. Booked, no-show | missed appointment, +1hr | rebook link + front-desk task created | WhatsApp → email fallback |
| 4. Post-consultation nurture | consultation completed | 90-day, low-frequency, educational only | WhatsApp → email fallback |

Rules: booking exits all sequences · **Band R leads excluded from all four sequences entirely** · unsubscribe (email, one-click) and STOP keyword (WhatsApp) must genuinely halt + deprovision, not just flag · all WhatsApp templates submitted for Meta approval before launch (parallel-track this early, Phase 2 timeline).

---

## 10. Analytics — GA4 Events

```
page_view
landing_page_view          {campaign_source, video_id}
assessment_start
assessment_question_complete   {question_number}
assessment_capture_view
assessment_capture_submit
assessment_result_view      {band, flags}
assessment_cta_click        {band, cta_position}
booking_start                {product}
booking_payment_initiated    {product, value}
booking_complete              {product, value}
imaging_upload_complete
whatsapp_click
phone_click
```
Conversion goal: `booking_complete` per product. Google Ads + Meta conversion tracking wired to same events. Looker Studio dashboard: full funnel + cost-per-booked-consultation by channel. Microsoft Clarity: landing pages + assessment only.

**Hard constraint:** none of the above events ever carry name/phone/email/symptom/answer values as parameters — `band` and `flags` (category-level) are fine, raw clinical content is not.

---

## 11. Environment Variables (example)

```
# Database
DATABASE_URL=

# CRM
CRM_PROVIDER=zoho|hubspot
CRM_API_KEY=

# WhatsApp BSP
WHATSAPP_BSP_PROVIDER=aisensy|wati|interakt
WHATSAPP_API_KEY=
WHATSAPP_WEBHOOK_SECRET=

# Email
EMAIL_PROVIDER=sendgrid|postmark
EMAIL_API_KEY=

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Booking
BOOKING_PROVIDER=calcom|calendly
BOOKING_API_KEY=

# Analytics
GA4_MEASUREMENT_ID=
CLARITY_PROJECT_ID=

# Storage (imaging — Phase 2)
S3_BUCKET=
S3_REGION=ap-south-1
S3_ACCESS_KEY=
S3_SECRET_KEY=

# App
NODE_ENV=production
DATA_RESIDENCY_REGION=ap-south-1
```

---

## 12. Technical Requirements

**Performance:** mobile LCP <2.5s (4G) · CLS <0.1 · INP <200ms · PageSpeed mobile >85 on key templates · WebP + lazy loading · deferred third-party scripts · landing templates <500KB. Test on real mid-range Android over mobile network, not desktop broadband.

**SEO:** schema (Physician, MedicalClinic, MedicalWebPage, FAQPage, BreadcrumbList, LocalBusiness) · one H1/page · XML sitemap, robots.txt, canonicals · hreflang (Hindi) · OG/Twitter cards · 301 map for legacy URLs.

**Accessibility:** WCAG 2.1 AA — keyboard nav, visible focus states, 4.5:1 contrast, alt text, associated labels, assessment fully usable via screen reader.

**Browser/device:** Chrome/Safari/Firefox/Edge (current + previous) · iOS 15+, Android 10+ · 360px+ viewport.

**Security:** HTTPS + HSTS · rate limiting on all forms (assessment, booking, contact) · bot protection (assessment + booking) without added friction for real users · daily automated backups, tested restore path · staging environment separate from production · secrets never in client-side bundles · webhook endpoints verify signatures (Razorpay, BSP, booking provider).

---

## 13. Build Order / Phasing

| Phase | Contents | Duration |
|---|---|---|
| 1 | Discovery, sitemap sign-off, template design | 1 week |
| 2 | Core build: homepage, 3 hubs, article template | 2 weeks |
| 3 | Assessment app (engine + placeholder config), result pages, lead capture + CRM sync | 1.5 weeks |
| 4 | Booking, payments, WhatsApp integration | 1.5 weeks |
| 5 | Analytics, tracking, testing, launch | 1 week |

~6–7 weeks. Submit WhatsApp templates for Meta approval during Phase 2 — don't let it gate launch. Imaging upload (DICOM support) is Phase 2 post-launch, not MVP — see below.

### MVP cut line
**Ship in Phase 1:** assessment engine (config-driven, placeholder-safe) · lead capture + CRM sync · email delivery · basic admin lead-status view · homepage + 3 hubs · booking CTAs deep-linking to call/WhatsApp (full calendar+payment engine can trail by a sprint if needed) · core GA4 events.

**Defer to Phase 2:** WhatsApp automation sequences · imaging upload/DICOM · locality pages (×6) · Hindi translations · full attribution dashboard · delivery-status tracking UI.

---

## 14. Data & Content Rules (build-time constraints, not legal commentary)

- Consent: purpose-specific, unticked by default, service ≠ marketing, both separate from terms acceptance. Stored with timestamp + IP + exact text version.
- Retention default: 24 months from last interaction, automated purge job.
- Unsubscribe/STOP genuinely deprovisions the record, doesn't just set a flag.
- Sensitive fields never in analytics params, URLs, or unauthenticated API responses.
- Content components must never render: patient testimonials, patient photos/scans, before/after imagery, superiority claims, success-rate percentages, urgency/scarcity devices, or implied individual outcomes. If a template ships with a testimonial slider, delete the component.
- Any AI-generated result copy is bounded by `results.config.json` templates — never freeform generation of clinical language.

---

## 15. Blocking Items Before Full Production Content

1. **Assessment Spec content** — the real 9 questions, scoring values, flag criteria, and band A/B/C/R copy. The engine ships without it; production launch cannot.
2. Pricing for the four consultation products.
3. WhatsApp/email sequence copy (currently placeholder in automation configs).
4. Hub/article/landing page copy, photography, video assets.
5. Grievance officer contact for `/grievance/`.
6. Confirmation on the Q8→capture→Q9 placement in the assessment flow (§5.4) — verify this is intentional before building it that way.

---

*This document is implementation-ready for everything except the clinical content itself (§15.1). Build the system so that content can be dropped into `questions.config.json` / `scoring.config.json` / `results.config.json` without touching application code.*
