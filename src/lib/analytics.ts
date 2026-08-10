declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export enum GA4_EVENTS {
  ASSESSMENT_START = 'assessment_start',
  QUESTION_COMPLETE = 'question_complete',
  CAPTURE_VIEW = 'capture_view',
  CAPTURE_SUBMIT = 'capture_submit',
  RESULT_VIEW = 'result_view',
  CTA_CLICK = 'cta_click',
  BOOKING_START = 'booking_start',
  BOOKING_PAYMENT_INITIATED = 'booking_payment_initiated',
  BOOKING_COMPLETE = 'booking_complete',
  LOGIN = 'login',
  SIGN_UP = 'sign_up',
  ERROR = 'error',
  PAGE_VIEW = 'page_view'
}

const PII_FIELDS = ['email', 'phone', 'name', 'password', 'address'];

/**
 * Tracks an event to GA4 via gtag, with a safety check to exclude PII.
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean | null | undefined>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  if (params) {
    for (const key of Object.keys(params)) {
      if (PII_FIELDS.some(pii => key.toLowerCase().includes(pii))) {
        console.warn(`Analytics Warning: Blocked potentially PII field "${key}" from being sent to GA4.`);
        delete params[key];
      }
    }
  }

  window.gtag('event', eventName, params);
}

export const trackAssessmentStart = () => trackEvent(GA4_EVENTS.ASSESSMENT_START);

export const trackQuestionComplete = (questionNumber: number) => 
  trackEvent(GA4_EVENTS.QUESTION_COMPLETE, { question_number: questionNumber });

export const trackCaptureView = () => trackEvent(GA4_EVENTS.CAPTURE_VIEW);

export const trackCaptureSubmit = () => trackEvent(GA4_EVENTS.CAPTURE_SUBMIT);

export const trackResultView = (band: string, flags: string[]) => 
  trackEvent(GA4_EVENTS.RESULT_VIEW, { band, flags: flags.join(',') });

export const trackCTAClick = (band: string, ctaPosition: string) => 
  trackEvent(GA4_EVENTS.CTA_CLICK, { band, cta_position: ctaPosition });

export const trackBookingStart = (product: string) => 
  trackEvent(GA4_EVENTS.BOOKING_START, { product });

export const trackBookingPaymentInitiated = (product: string, value: number) => 
  trackEvent(GA4_EVENTS.BOOKING_PAYMENT_INITIATED, { product, value, currency: 'INR' });

export const trackBookingComplete = (product: string, value: number) => 
  trackEvent(GA4_EVENTS.BOOKING_COMPLETE, { product, value, currency: 'INR' });
