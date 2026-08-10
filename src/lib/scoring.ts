import scoringConfigData from '@/config/scoring.config.json';

export type Band = 'A' | 'B' | 'C' | 'R';

export interface FlagOverride {
  flag: string;
  forces_band: string;
  description: string;
}

export interface ScoringConfig {
  version: string;
  bands: {
    A: { min: number; max: number };
    B: { min: number; max: number };
    C: { min: number; max: number };
  };
  flag_overrides: FlagOverride[];
}

/**
 * Validates and returns the scoring configuration.
 * Never hardcode thresholds — always read from config.
 */
export function loadScoringConfig(): ScoringConfig {
  return scoringConfigData as unknown as ScoringConfig;
}

/**
 * Evaluates an assessment and determines the score and band.
 * @param answers - A record mapping question IDs to the user's selected value, points, and optional flags
 * @returns The resulting band, total points, and all triggered flags
 */
export function scoreAssessment(
  answers: Record<string, { value: string; points: number; flags?: string[] }>
): { band: Band; totalPoints: number; flags: string[] } {
  const config = loadScoringConfig();

  let totalPoints = 0;
  const triggeredFlags = new Set<string>();

  // Sum points and collect flags from all answers
  for (const [, answer] of Object.entries(answers)) {
    totalPoints += answer.points;
    if (answer.flags) {
      answer.flags.forEach((flag) => triggeredFlags.add(flag));
    }
  }

  const allFlags = Array.from(triggeredFlags);

  // Check flag overrides — if any triggered flag forces Band R, return R immediately
  for (const override of config.flag_overrides) {
    if (allFlags.includes(override.flag) && override.forces_band === 'R') {
      return { band: 'R', totalPoints, flags: allFlags };
    }
  }

  // Fall back to point-range band assignment
  if (totalPoints >= config.bands.A.min && totalPoints <= config.bands.A.max) {
    return { band: 'A', totalPoints, flags: allFlags };
  }
  if (totalPoints >= config.bands.B.min && totalPoints <= config.bands.B.max) {
    return { band: 'B', totalPoints, flags: allFlags };
  }
  if (totalPoints >= config.bands.C.min && totalPoints <= config.bands.C.max) {
    return { band: 'C', totalPoints, flags: allFlags };
  }

  // Default to C if score doesn't match any defined band range
  return { band: 'C', totalPoints, flags: allFlags };
}

