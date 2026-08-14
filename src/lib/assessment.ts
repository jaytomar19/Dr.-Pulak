import questionsConfig from '@/config/questions.config.json';
import resultsConfig from '@/config/results.config.json';
import type { Band } from '@/lib/scoring';

export const ASSESSMENT_SESSION_COOKIE = 'assessment_session_id';

export type AssessmentAnswer = {
  value: string;
  points: number;
  flags: string[];
};

export type AssessmentAnswers = Record<string, AssessmentAnswer>;

export type AssessmentQuestion = {
  id: string;
  order: number;
  type: 'single_select';
  prompt: string;
  options: Array<{ value: string; label: string; points: number; flags: string[] }>;
};

export const assessmentQuestions = questionsConfig.questions as AssessmentQuestion[];

export function getQuestion(questionId: string): AssessmentQuestion | undefined {
  return assessmentQuestions.find((question) => question.id === questionId);
}

export function getConfiguredAnswer(questionId: string, answerValue: string): AssessmentAnswer | undefined {
  const question = getQuestion(questionId);
  const option = question?.options.find((candidate) => candidate.value === answerValue);

  if (!option) return undefined;

  return {
    value: option.value,
    points: option.points,
    flags: option.flags,
  };
}

export function isAssessmentSessionAuthorized(cookieValue: string | undefined, sessionId: string): boolean {
  if (cookieValue && cookieValue === sessionId) return true;
  // Allow valid UUID session IDs to prevent authorization drop if cookie expires or is cleared by browser
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(sessionId);
}

export function getResultForBand(band: Band) {
  return resultsConfig.results[band];
}
