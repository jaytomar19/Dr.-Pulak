# Dr. Pulak Vatsya Clinical Platform — Production Launch Checklist

This document serves as the master pre-flight checklist for deploying `drpulakvatsya.com` to production (Vercel + Supabase).

---

## A. Code & Architecture (Completed & Verified)

- [x] **Core Framework**: Next.js 16 (App Router), React 19, TypeScript 5.
- [x] **Database & ORM**: PostgreSQL on Supabase with Prisma ORM 6.3.1.
- [x] **Initial Migration**: `20260811084626_init` applied to database; 6 normalized tables created.
- [x] **PII Encryption at Rest**: AES-256-GCM authenticated encryption on patient phone and email (`src/lib/encryption.ts`).
- [x] **Authentication & RBAC**: Auth.js v5 JWT auth with bcrypt (12 rounds) supporting `doctor`, `admin`, and `staff` role enforcement (`src/lib/rbac.ts`).
- [x] **Public Rate Limiting**: In-memory sliding-window IP rate limiter active on public POST APIs (`src/lib/rate-limit.ts`).
- [x] **Patient Assessment Engine**: 9-question clinical triage funnel, deterministic scoring (`scoring.ts`), Band A/B/C/R risk stratification, and session cookie management.
- [x] **Lead Pipeline & Audit**: Dual consent tracking (`service` + `marketing`) with IP and version logging, masked PII by default in admin UI (`••••••••`), and on-demand decryption.
- [x] **Consultation Booking Engine**: Multi-tier booking API (`/api/bookings`) with collision prevention, future timestamp validation, and Prisma transaction linkage.
- [x] **Razorpay Payment Integration**: Server-side order creation (`/api/payments/create-order`) and cryptographically verified webhook handler (`/api/webhooks/payment-confirmed`) with HMAC SHA-256 signature verification.
- [x] **Notification Engine**: Transactional email driver (Postmark abstraction), WhatsApp BSP stub, `delivery_log` audit logging, and non-blocking Band-R urgent clinical alerts.
- [x] **Admin Suite**: Dashboard (`/admin/dashboard`), Leads (`/admin/leads`), Bookings (`/admin/bookings`), Assessments (`/admin/assessments`), and Users (`/admin/users`).
- [x] **SEO & Performance**: `sitemap.xml`, `robots.txt` (disallowing `/admin/*` and `/api/*`), zero-CLS `next/font/google` (`Inter`), OpenGraph metadata, and custom 404/error boundaries.
- [x] **Type & Lint Check**: TypeScript: 0 errors; ESLint: 0 errors / 0 warnings; Webpack build: 48 routes compiled successfully.

---

## B. Client Inputs Required (Dr. Pulak Vatsya)

*Note: Code contains clearly marked `[DOCTOR APPROVED COPY REQUIRED]` and config placeholders. Replace in configuration files without modifying application logic.*

- [ ] **Clinical Result Copy (`src/config/results.config.json`)**:
  - [ ] **Band A** (Mild / Lifestyle Care): Summary, possible causes, next steps, CTA options.
  - [ ] **Band B** (Moderate / Conservative Management): Summary, possible causes, next steps, CTA options.
  - [ ] **Band C** (Advanced OA / Surgical Evaluation): Summary, possible causes, next steps, CTA options.
  - [ ] **Band R** (High-Risk / Urgent Clinical Review): Summary, possible causes, next steps, CTA options.
- [ ] **Practice Information (`src/config/practice.ts`)**:
  - [ ] Official Clinic Phone Number (e.g. `+91 98XXX XXXXX`).
  - [ ] Official Clinic Email Address (e.g. `care@drpulakvatsya.com`).
  - [ ] Complete Postal Address & Landmark for *StepUp Joints*, Lajpat Nagar, New Delhi.
  - [ ] Google Maps Place Link & Iframe Embed URL.
- [ ] **Media & Education Content (`src/config/media.ts`)**:
  - [ ] Official YouTube Video IDs & Titles for Patient Education Grid.
  - [ ] Official Instagram Reel URLs & Titles for Reels Grid.

---

## C. Third-Party Provider Accounts Required

- [ ] **Supabase PostgreSQL Database**:
  - [ ] Production project created in `ap-south-1` (Mumbai).
  - [ ] Connection string configured via Session Pooler (port 5432 or 6543) with PgBouncer.
- [ ] **Razorpay Payment Gateway**:
  - [ ] KYC verified Razorpay merchant account.
  - [ ] Live Key ID (`RAZORPAY_KEY_ID`) and Key Secret (`RAZORPAY_KEY_SECRET`).
  - [ ] Webhook URL configured in Razorpay Dashboard (`https://drpulakvatsya.com/api/webhooks/payment-confirmed`) with events `payment.captured` and `order.paid`.
  - [ ] Webhook Secret generated and saved (`RAZORPAY_WEBHOOK_SECRET`).
- [ ] **Postmark Transactional Email**:
  - [ ] Postmark Server API Token (`EMAIL_API_KEY`).
  - [ ] Sender Signature / Domain verified for `drpulakvatsya.com` (`EMAIL_FROM_ADDRESS`).
  - [ ] Inbound / Delivery Webhook configured (`https://drpulakvatsya.com/api/webhooks/email-status`).
- [ ] **WhatsApp Business Provider (Optional / Phase 2)**:
  - [ ] Aisensy / Interakt BSP account and approved HSM templates.
- [ ] **Google Analytics 4 / Microsoft Clarity (Optional)**:
  - [ ] GA4 Measurement ID (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`).
  - [ ] Clarity Project ID (`NEXT_PUBLIC_CLARITY_PROJECT_ID`).

---

## D. Deployment Configuration Required (Vercel)

Set the following Environment Variables in Vercel Project Settings:

| Environment Variable | Purpose | Classification |
| :--- | :--- | :--- |
| `DATABASE_URL` | Supabase PostgreSQL Session Pooler Connection String | **Mandatory** |
| `ENCRYPTION_KEY` | 64-hex char AES-256 key for PII encryption at rest | **Mandatory** |
| `NEXTAUTH_SECRET` | 32+ char secret for JWT session signing | **Mandatory** |
| `NEXTAUTH_URL` | Canonical domain: `https://drpulakvatsya.com` | **Mandatory** |
| `NODE_ENV` | `production` | **Mandatory** |
| `RAZORPAY_KEY_ID` | Razorpay Live Key ID | **Mandatory for Payments** |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Secret Key | **Mandatory for Payments** |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Signature Secret | **Mandatory for Payments** |
| `EMAIL_PROVIDER` | `postmark` | **Mandatory for Notifications** |
| `EMAIL_API_KEY` | Postmark Server API Token | **Mandatory for Notifications** |
| `EMAIL_FROM_ADDRESS` | Verified Sender Email (`noreply@drpulakvatsya.com`) | **Mandatory for Notifications** |
| `ADMIN_SEED_EMAIL` | Initial Doctor/Admin login email (run once via `db:seed`) | **Mandatory for Initial Setup** |
| `ADMIN_SEED_PASSWORD` | Strong initial temporary password | **Mandatory for Initial Setup** |
| `ADMIN_SEED_NAME` | `Dr. Pulak Vatsya` | **Mandatory for Initial Setup** |

---

## E. Final Launch Verification Sequence (On Day of Launch)

1. [ ] Deploy build to Vercel Staging preview branch.
2. [ ] Apply Prisma migrations to production Supabase database: `npx prisma migrate deploy`.
3. [ ] Run seed script once to create initial doctor account: `npm run db:seed`.
4. [ ] Log in at `https://drpulakvatsya.com/admin/login` and immediately change the seed password.
5. [ ] Perform complete live smoke test on Staging:
   - [ ] Run full 9-question knee assessment; verify result page renders correct band.
   - [ ] Submit contact details; verify lead appears in `/admin/leads` with encrypted phone/email.
   - [ ] Trigger Band R result; verify internal alert email is delivered to staff.
   - [ ] Book a test consultation slot; verify entry in `/admin/bookings`.
   - [ ] Execute test Razorpay payment (₹1 test transaction); verify booking status transitions to `paid` and `confirmed`.
6. [ ] Point custom domain DNS (`drpulakvatsya.com`) to Vercel.
7. [ ] Verify SSL certificate and HTTPS redirection.
