'use client';

import { FormEvent, useEffect, useMemo, useState, useCallback } from 'react';
import questionsConfig from '@/config/questions.config.json';
import {
  trackAssessmentStart,
  trackQuestionComplete,
  trackCaptureView,
  trackCaptureSubmit,
  trackResultView,
} from '@/lib/analytics';
import Loader from '@/components/shared/Loader';
import BookingModal from '@/components/public/BookingModal';
import './assessment.css';

type Screen = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'contact_capture' | 'q9' | 'completion' | 'result';
type Answers = Record<string, string>;
type Result = {
  summary: string;
  possible_causes: string[];
  next_step: string;
  show_ctas: boolean;
  cta_options: string[];
};

const screens: Screen[] = ['intro', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'contact_capture', 'q9', 'completion', 'result'];
const sessionStorageKey = 'drpulak-assessment-session';
const consentTextVersion = 'assessment-consent-v1';
const questions = questionsConfig.questions;

function screenForProgress(questionNumber: number): Screen {
  return `q${questionNumber}` as Screen;
}

function getResumeScreen(answers: Answers, hasContact: boolean): Screen {
  const nextQuestion = questions.find((question) => !answers[question.id]);
  if (nextQuestion && nextQuestion.order <= 8) return screenForProgress(nextQuestion.order);
  if (!hasContact) return 'contact_capture';
  if (nextQuestion) return 'q9';
  return 'completion';
}

export default function AssessmentPage() {
  const [savedSession] = useState<{ sessionId: string; answers: Answers; hasContact: boolean } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.sessionStorage.getItem(sessionStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { sessionId?: string; answers?: Answers; hasContact?: boolean };
      return parsed.sessionId
        ? { sessionId: parsed.sessionId, answers: parsed.answers ?? {}, hasContact: Boolean(parsed.hasContact) }
        : null;
    } catch {
      window.sessionStorage.removeItem(sessionStorageKey);
      return null;
    }
  });

  const [screen, setScreen] = useState<Screen>('intro');
  const [sessionId, setSessionId] = useState<string | null>(savedSession?.sessionId ?? null);
  const [answers, setAnswers] = useState<Answers>(savedSession?.answers ?? {});
  const [hasContact, setHasContact] = useState(savedSession?.hasContact ?? false);
  const [resumeAvailable] = useState(Boolean(savedSession?.sessionId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const question = useMemo(
    () => questions.find((candidate) => candidate.id === screen),
    [screen],
  );

  const [activeSelection, setActiveSelection] = useState<Record<string, string>>({});
  const selectedOption = question ? (activeSelection[question.id] || answers[question.id] || null) : null;

  const questionNumber = question?.order ?? (screen === 'contact_capture' ? 8 : screen === 'completion' || screen === 'result' ? 9 : 0);
  const progress = Math.min(100, Math.round((questionNumber / questions.length) * 100));

  const saveSession = (nextSessionId: string, nextAnswers: Answers, nextHasContact: boolean) => {
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify({
      sessionId: nextSessionId,
      answers: nextAnswers,
      hasContact: nextHasContact,
    }));
  };

  const start = useCallback(async () => {
    setError(null);
    if (sessionId && resumeAvailable) {
      setScreen(getResumeScreen(answers, hasContact));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/assessment/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to start the assessment');

      setSessionId(data.session_id);
      setAnswers({});
      setHasContact(false);
      saveSession(data.session_id, {}, false);
      setScreen('q1');

      trackAssessmentStart();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to start the assessment');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, resumeAvailable, answers, hasContact]);

  // Automatically start assessment on mount if screen is 'intro' (removes duplicate intro/loading card)
  useEffect(() => {
    let mounted = true;
    if (screen === 'intro') {
      const init = async () => {
        if (!mounted) return;
        await start();
      };
      init();
    }
    return () => {
      mounted = false;
    };
  }, [screen, start]);


  // GA4: Track contact capture view when screen transitions to contact_capture
  useEffect(() => {
    if (screen === 'contact_capture') trackCaptureView();
  }, [screen]);

  const submitAnswer = async (answerValue: string) => {
    if (!sessionId || !question) return;
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/assessment/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: question.id, answer_value: answerValue }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Assessment is already complete' || response.status === 409) {
          await loadResult(sessionId);
          return;
        }
        throw new Error(data.error ?? 'Unable to save your response');
      }

      const nextAnswers = { ...answers, [question.id]: answerValue };
      setAnswers(nextAnswers);
      saveSession(sessionId, nextAnswers, hasContact);

      trackQuestionComplete(question.order);

      if (question.order === 8) {
        setScreen('contact_capture');
      } else if (question.order === 9) {
        await loadResult(sessionId);
      } else {
        setScreen(screenForProgress(question.order + 1));
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save your response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!question) return;
    const optionToSubmit = selectedOption || answers[question.id];
    if (question.order === 9) {
      if (optionToSubmit) {
        await submitAnswer(optionToSubmit);
      } else {
        await loadResult(sessionId ?? undefined);
      }
    } else {
      if (optionToSubmit) {
        await submitAnswer(optionToSubmit);
      } else {
        handleSkip();
      }
    }
  };


  const handleSkip = () => {
    if (!question) return;
    if (question.order === 8) {
      setScreen('contact_capture');
    } else if (question.order === 9) {
      if (sessionId) loadResult(sessionId);
    } else {
      setScreen(screenForProgress(question.order + 1));
    }
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionId) return;
    setError(null);
    setIsLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          consent_service: formData.get('consent_service') === 'on',
          consent_marketing: formData.get('consent_marketing') === 'on',
          consent_text_version: consentTextVersion,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to save your contact details');

      trackCaptureSubmit();

      setHasContact(true);
      saveSession(sessionId, answers, true);
      form?.reset();
      setScreen('q9');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to save your contact details');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setError(null);
    const currentIndex = screens.indexOf(screen);
    if (currentIndex > 0) setScreen(screens[currentIndex - 1]);
  };

  const loadResult = async (overrideSessionId?: string) => {
    const targetSessionId = overrideSessionId || sessionId;
    if (!targetSessionId) return;
    setError(null);
    setIsLoading(true);
    try {
      const scoreResponse = await fetch('/api/assessment/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: targetSessionId }),
      });
      const scoreData = await scoreResponse.json();
      if (!scoreResponse.ok) throw new Error(scoreData.error ?? 'Unable to complete the assessment');

      const resultResponse = await fetch(`/api/assessment/result/${targetSessionId}`);
      const resultData = await resultResponse.json();
      if (!resultResponse.ok) throw new Error(resultData.error ?? 'Unable to load your result');

      setResult(resultData.result);
      setScreen('result');

      trackResultView(scoreData.band ?? '', Array.isArray(scoreData.flags) ? scoreData.flags : []);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to complete the assessment');
    } finally {
      setIsLoading(false);
    }
  };

  // Minimal full-screen spinner on initial session load (no duplicate "Knee Check" card)
  if (screen === 'intro') {
    return (
      <main className="assessment-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
          <Loader size="lg" color="primary" label="Preparing assessment..." />
        </div>
      </main>
    );
  }

  return (
    <main className="assessment-page">
      <section className="assessment-card" aria-labelledby="assessment-title">
        {/* Header with Title, Subtitle, and Progress Bar */}
        {screen !== 'result' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <div>
                <p className="assessment-muted" style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                  Free assessment
                </p>
                <h1 id="assessment-title" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-navy)', margin: '0.25rem 0' }}>
                  Knee Check
                </h1>
                <p className="assessment-muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                  {questionNumber} of {questions.length} questions
                </p>
              </div>
              <div style={{ textAlign: 'right', paddingTop: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  {progress}% complete
                </span>
              </div>
            </div>

            <div className="assessment-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={questionNumber}>
              <div className="assessment-progress__bar" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* QUESTION SCREEN (Q1 TO Q9) */}
        {question && (
          <div key={screen} className="assessment-step-content">
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              {question.prompt}
            </h2>

            <div className="assessment-options">
              {question.options.map((option) => {
                const isSelected = selectedOption === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`assessment-option ${isSelected ? 'assessment-option--selected' : ''}`}
                    onClick={() => {
                      setActiveSelection((prev) => ({ ...prev, [question.id]: option.value }));
                      submitAnswer(option.value);
                    }}

                    disabled={isLoading}
                    data-cursor="button"
                  >
                    <span style={{ fontWeight: isSelected ? 700 : 500 }}>{option.label}</span>
                    <span aria-hidden="true" style={{ color: isSelected ? 'var(--color-primary)' : 'inherit', fontSize: '1.1rem' }}>
                      {isSelected ? '✓' : '→'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ACTION FOOTER BUTTONS BAR (PREVIOUS, BOOK APPOINTMENT, SKIP, NEXT/END) */}
            <div className="assessment-question-actions">
              {question.order > 1 && (
                <button
                  type="button"
                  className="btn-assessment-action btn-assessment-action--prev"
                  onClick={goBack}
                  disabled={isLoading}
                  data-cursor="button"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>
              )}

              <button
                type="button"
                className="btn-assessment-action btn-assessment-action--book"
                onClick={() => setIsBookingModalOpen(true)}
                data-cursor="button"
              >
                <span>📅</span>
                <span>Book Appointment</span>
              </button>

              <button
                type="button"
                className="btn-assessment-action btn-assessment-action--skip"
                onClick={handleSkip}
                disabled={isLoading}
                data-cursor="button"
              >
                <span>⏭️</span>
                <span>Skip Question</span>
              </button>

              <button
                type="button"
                className={`btn-assessment-action btn-assessment-action--next ${question.order === 9 ? 'btn-assessment-action--end' : ''}`}
                onClick={handleNext}
                disabled={isLoading}
                data-cursor="button"
              >
                <span>{question.order === 9 ? 'End Assessment' : 'Next'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

        )}

        {/* CONTACT CAPTURE SCREEN */}
        {screen === 'contact_capture' && (
          <form key="contact_capture" className="assessment-form assessment-step-content" onSubmit={submitContact}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', marginBottom: '0.25rem' }}>Contact details</h2>
            <p className="assessment-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              We use these details to record your consent and deliver your clinical assessment score.
            </p>
            <label className="assessment-field">Full Name<input name="name" autoComplete="name" required minLength={2} maxLength={120} /></label>
            <label className="assessment-field">WhatsApp/Mobile<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" /></label>
            <label className="assessment-field">Email<input name="email" type="email" autoComplete="email" required /></label>
            <label className="assessment-consent"><input name="consent_service" type="checkbox" required />I consent to the use of my details to provide this assessment-related service.</label>
            <label className="assessment-consent"><input name="consent_marketing" type="checkbox" />I would like to receive marketing communications.</label>
            <div className="assessment-actions">
              <button className="assessment-button assessment-button--secondary" type="button" onClick={goBack} disabled={isLoading} data-cursor="button">Back</button>
              <button className="assessment-button" type="submit" disabled={isLoading} data-cursor="button">
                {isLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader size="sm" color="white" />
                    <span>Saving…</span>
                  </span>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        )}

        {/* COMPLETION SCREEN */}
        {screen === 'completion' && (
          <div key="completion" className="assessment-step-content">
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)' }}>Assessment complete</h2>
            <p className="assessment-muted" style={{ marginTop: '0.5rem' }}>
              Your responses are ready to be processed using the doctor-approved assessment rules.
            </p>
            <div className="assessment-actions">
              <button className="assessment-button assessment-button--secondary" type="button" onClick={goBack} disabled={isLoading} data-cursor="button">Back</button>
              <button className="assessment-button" type="button" onClick={() => loadResult()} disabled={isLoading} data-cursor="button">
                {isLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader size="sm" color="white" />
                    <span>Analyzing Responses…</span>
                  </span>
                ) : (
                  'View result'
                )}
              </button>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === 'result' && result && (
          <div key="result" className="assessment-step-content">
            <p className="assessment-muted" style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
              Assessment result
            </p>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-navy)', margin: '0.25rem 0 1rem 0' }}>
              Clinical Assessment Guidance
            </h2>
            <p className="assessment-result-summary" style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>{result.summary}</p>
            {result.possible_causes && result.possible_causes.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}>Key Considerations</h3>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                  {result.possible_causes.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            )}
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--color-bg-base)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{result.next_step}</p>
            </div>

            {/* Render Commercial Consultation CTAs ONLY for normal bands (A, B, C). Suppress for Band R safety */}
            {result.show_ctas && result.cta_options && result.cta_options.length > 0 && (
              <div className="assessment-actions" style={{ marginTop: '1.75rem', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="btn btn--pill-primary btn--lg"
                  style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}
                  data-cursor="button"
                >
                  <span>Book Medical Consultation</span>
                  <span className="btn--pill-icon">↗</span>
                </button>
              </div>
            )}

            {!result.show_ctas && (
              <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', color: '#991B1B', fontSize: '0.9rem', lineHeight: '1.5' }}>
                🩺 <strong>Clinical Evaluation Priority</strong>: Based on your reported symptoms, an immediate clinical evaluation by an orthopaedic specialist is recommended. Commercial booking offers are omitted for your medical safety.
              </div>
            )}
          </div>
        )}

        {error && <p className="assessment-error" role="alert">{error}</p>}
      </section>

      {/* Global Booking Modal triggered by "Book Appointment" */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </main>
  );
}
