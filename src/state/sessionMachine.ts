import { setup, assign } from 'xstate';

interface SessionContext {
  sessionId: string | null;
  currentQuestion: number;
  answers: Record<string, { value: string; points: number }>;
  contactInfo: { name: string; phone: string; email: string } | null;
  consents: { service: boolean; marketing: boolean } | null;
  bandResult: 'A' | 'B' | 'C' | 'R' | null;
  flags: string[];
  error: string | null;
}

type SessionEvents =
  | { type: 'START' }
  | { type: 'ANSWER'; question_id: string; answer_value: string; points: number }
  | { type: 'SUBMIT_CONTACT'; name: string; phone: string; email: string; consents: { service: boolean; marketing: boolean } }
  | { type: 'BACK' }
  | { type: 'VIEW_RESULT' };

export const sessionMachine = setup({
  types: {
    context: {} as SessionContext,
    events: {} as SessionEvents,
  },
  actions: {
    assignAnswer: assign({
      answers: ({ context, event }) => {
        if (event.type !== 'ANSWER') return context.answers;
        return {
          ...context.answers,
          [event.question_id]: { value: event.answer_value, points: event.points },
        };
      },
    }),
    assignContact: assign({
      contactInfo: ({ event }) => {
        if (event.type !== 'SUBMIT_CONTACT') return null;
        return { name: event.name, phone: event.phone, email: event.email };
      },
      consents: ({ event }) => {
        if (event.type !== 'SUBMIT_CONTACT') return null;
        return event.consents;
      },
    }),
  },
}).createMachine({
  id: 'assessment',
  initial: 'idle',
  context: {
    sessionId: null,
    currentQuestion: 0,
    answers: {},
    contactInfo: null,
    consents: null,
    bandResult: null,
    flags: [],
    error: null,
  },
  states: {
    idle: {
      on: { START: 'intro' },
    },
    intro: {
      on: {
        START: 'q1',
        BACK: 'idle',
      },
    },
    q1: {
      on: {
        ANSWER: { target: 'q2', actions: 'assignAnswer' },
        BACK: 'intro',
      },
    },
    q2: {
      on: {
        ANSWER: { target: 'q3', actions: 'assignAnswer' },
        BACK: 'q1',
      },
    },
    q3: {
      on: {
        ANSWER: { target: 'q4', actions: 'assignAnswer' },
        BACK: 'q2',
      },
    },
    q4: {
      on: {
        ANSWER: { target: 'q5', actions: 'assignAnswer' },
        BACK: 'q3',
      },
    },
    q5: {
      on: {
        ANSWER: { target: 'q6', actions: 'assignAnswer' },
        BACK: 'q4',
      },
    },
    q6: {
      on: {
        ANSWER: { target: 'q7', actions: 'assignAnswer' },
        BACK: 'q5',
      },
    },
    q7: {
      on: {
        ANSWER: { target: 'q8', actions: 'assignAnswer' },
        BACK: 'q6',
      },
    },
    q8: {
      on: {
        ANSWER: { target: 'contact_capture', actions: 'assignAnswer' },
        BACK: 'q7',
      },
    },
    contact_capture: {
      on: {
        SUBMIT_CONTACT: { target: 'q9', actions: 'assignContact' },
        BACK: 'q8',
      },
    },
    q9: {
      on: {
        ANSWER: { target: 'completion', actions: 'assignAnswer' },
        BACK: 'contact_capture',
      },
    },
    completion: {
      on: {
        VIEW_RESULT: 'result',
      },
    },
    result: {
      type: 'final',
    },
  },
});
