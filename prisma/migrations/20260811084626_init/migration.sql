-- CreateEnum
CREATE TYPE "BandResult" AS ENUM ('A', 'B', 'C', 'R');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('New', 'Contacted', 'Interested', 'Booked', 'Converted', 'NotInterested', 'NoResponse', 'Invalid', 'Closed');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('service', 'marketing');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('whatsapp', 'email');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('queued', 'sent', 'delivered', 'failed');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('opd', 'online_live', 'imaging_review', 'second_opinion');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'refunded');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('confirmed', 'completed', 'no_show', 'cancelled', 'rescheduled');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('doctor', 'admin', 'staff');

-- CreateTable
CREATE TABLE "assessment_sessions" (
    "session_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_source" TEXT,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "band_result" "BandResult",
    "flags" JSONB NOT NULL DEFAULT '[]',
    "completed_at" TIMESTAMP(3),
    "lead_id" UUID,

    CONSTRAINT "assessment_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "leads" (
    "lead_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "session_id" UUID,
    "source" TEXT,
    "landing_page" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "referral" TEXT,
    "lead_status" "LeadStatus" NOT NULL DEFAULT 'New',
    "appointment_status" TEXT,
    "consultation_status" TEXT,
    "notes" TEXT,
    "assigned_staff" TEXT,
    "last_contacted_at" TIMESTAMP(3),
    "next_followup_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("lead_id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "consent_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "consent_type" "ConsentType" NOT NULL,
    "consent_text_version" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("consent_id")
);

-- CreateTable
CREATE TABLE "delivery_log" (
    "id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "channel" "DeliveryChannel" NOT NULL,
    "template_name" TEXT,
    "status" "DeliveryStatus" NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "delivery_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" UUID NOT NULL,
    "lead_id" UUID NOT NULL,
    "product" "ProductType" NOT NULL,
    "slot_datetime" TIMESTAMPTZ NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "payment_provider_ref" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_sessions_lead_id_key" ON "assessment_sessions"("lead_id");

-- CreateIndex
CREATE INDEX "assessment_sessions_band_result_idx" ON "assessment_sessions"("band_result");

-- CreateIndex
CREATE INDEX "assessment_sessions_lead_id_idx" ON "assessment_sessions"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_session_id_key" ON "leads"("session_id");

-- CreateIndex
CREATE INDEX "leads_lead_status_idx" ON "leads"("lead_status");

-- CreateIndex
CREATE INDEX "leads_session_id_idx" ON "leads"("session_id");

-- CreateIndex
CREATE INDEX "consent_records_lead_id_idx" ON "consent_records"("lead_id");

-- CreateIndex
CREATE INDEX "delivery_log_lead_id_idx" ON "delivery_log"("lead_id");

-- CreateIndex
CREATE INDEX "bookings_lead_id_idx" ON "bookings"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "assessment_sessions" ADD CONSTRAINT "assessment_sessions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "assessment_sessions"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_log" ADD CONSTRAINT "delivery_log_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("lead_id") ON DELETE RESTRICT ON UPDATE CASCADE;
