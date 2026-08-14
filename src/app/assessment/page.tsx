'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import questionsConfig from '@/config/questions.config.json';
import {
  trackAssessmentStart,
  trackQuestionComplete,
  trackCaptureView,
  trackCaptureSubmit,
  trackResultView,
} from '@/lib/analytics';
import Loader from '@/components/shared/Loader';
import './assessment.css';

// Metadata is exported from a sibling server component when using the App Router;
// for client components it is declared in the nearest server layout or via generateMetadata.
// The metadata for this route is configured in layout.tsx at the assessment segment level.

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
  // Read sessionStorage once at mount (lazy initialisers avoid setState-in-effect).
  // Using functions here means this runs only on the initial render, not on every re-render.
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

  const question = useMemo(
    () => questions.find((candidate) => candidate.id === screen),
    [screen],
  );
  const questionNumber = question?.order ?? (screen === 'contact_capture' ? 8 : screen === 'completion' || screen === 'result' ? 9 : 0);
  const progress = Math.min(100, (questionNumber / questions.length) * 100);

  // GA4: Track contact capture view when screen transitions to contact_capture
  useEffect(() => {
    if (screen === 'contact_capture') trackCaptureView();
  }, [screen]);

  const saveSession = (nextSessionId: string, nextAnswers: Answers, nextHasContact: boolean) => {
    window.sessionStorage.setItem(sessionStorageKey, JSON.stringify({
      sessionId: nextSessionId,
      answers: nextAnswers,
      hasContact: nextHasContact,
    }));
  };

  const start = async () => {
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

      // GA4: assessment_start — fired once per new session, no PII
      trackAssessmentStart();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to start the assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answerValue: string) => {
    if (!sessionId || !question) return;
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/assessment/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // NOTE: answerValue is the config key (e.g. "opt_a"), NOT clinical text — safe to send.
        // However we do NOT include it in GA4 params per spec §10 hard constraint.
        body: JSON.stringify({ question_id: question.id, answer_value: answerValue }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to save your response');

      const nextAnswers = { ...answers, [question.id]: answerValue };
      setAnswers(nextAnswers);
      saveSession(sessionId, nextAnswers, hasContact);

      // GA4: assessment_question_complete — question_number only, no answer value or clinical content
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

      // GA4: assessment_capture_submit — no PII in params
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

      // GA4: assessment_result_view — band and flags are category-level, not clinical detail
      trackResultView(scoreData.band ?? '', Array.isArray(scoreData.flags) ? scoreData.flags : []);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to complete the assessment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="assessment-page">
      <section className="assessment-card" aria-labelledby="assessment-title">
        <p className="assessment-muted">Free assessment</p>
        <h1 id="assessment-title">Knee Check</h1>
        {screen !== 'intro' && (
          <>
            <p className="assessment-muted">{questionNumber} of {questions.length} questions</p>
            <div className="assessment-progress" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={questionNumber}>
              <div className="assessment-progress__bar" style={{ width: `${progress}%` }} />
            </div>
          </>
        )}

        {screen === 'intro' && (
          <div key="intro" className="assessment-step-content">
            <p>This assessment uses doctor-approved configuration when it becomes available. It does not provide a diagnosis.</p>
            <div className="assessment-actions assessment-actions--single">
              <button className="assessment-button" type="button" onClick={start} disabled={isLoading} data-cursor="button">
                {isLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader size="sm" color="white" />
                    <span>Starting…</span>
                  </span>
                ) : resumeAvailable ? (
                  'Resume assessment'
                ) : (
                  'Start assessment'
                )}
              </button>
            </div>
          </div>
        )}

        {question && (
          <div key={screen} className="assessment-step-content">
            <h2>{question.prompt}</h2>
            <div className="assessment-options">
              {question.options.map((option) => (
                <button className="assessment-option" type="button" key={option.value} onClick={() => submitAnswer(option.value)} disabled={isLoading} data-cursor="button">
                  <span>{option.label}</span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
            <div className="assessment-actions">
              <button className="assessment-button assessment-button--secondary" type="button" onClick={goBack} disabled={isLoading} data-cursor="button">Back</button>
            </div>
          </div>
        )}

        {screen === 'contact_capture' && (
          <form key="contact_capture" className="assessment-form assessment-step-content" onSubmit={submitContact}>
            <h2>Contact details</h2>
            <p>We use these details to follow up about your assessment request.</p>
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

        {screen === 'completion' && (
          <div key="completion" className="assessment-step-content">
            <h2>Assessment complete</h2>
            <p>Your responses are ready to be processed using the configured assessment rules.</p>
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

        {screen === 'result' && result && (
          <div key="result" className="assessment-step-content">
            <h2>Clinical Assessment Guidance</h2>
            <p className="assessment-result-summary" style={{ fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>{result.summary}</p>
            {result.possible_causes && result.possible_causes.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.1rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>Key Considerations</h3>
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
                <a
                  href="/consult/"
                  className="btn btn--pill-primary btn--lg"
                  style={{ justifyContent: 'center', width: '100%', textDecoration: 'none' }}
                  data-cursor="button"
                >
                  <span>Book Medical Consultation</span>
                  <span className="btn--pill-icon">↗</span>
                </a>
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
    </main>
  );
}
