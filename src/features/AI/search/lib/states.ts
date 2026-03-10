import { parseAsNumberLiteral, parseAsStringLiteral, useQueryState } from "nuqs";
import { LAW_OPTIONS } from "../constants";

const LAW_VALUES = LAW_OPTIONS.map((o) => o.value);
export type LawValue = (typeof LAW_OPTIONS)[number]["value"];

/** nuqs-ისთვის ვალიდური კანონის მნიშვნელობის დაბრუნება */
export function snapLaw(value: string | undefined): LawValue {
  if (value === "civil" || value === "administrative") return value;
  return "__all__";
}

export const RESULT_VALUES = ["5", "10", "15", "20", "50", "100"] as const;
export type ResultValue = (typeof RESULT_VALUES)[number];

/** nuqs-ისთვის ვალიდური მნიშვნელობის დაბრუნება */
export function snapResult(value: string | number): ResultValue {
  const str = String(value);
  return RESULT_VALUES.includes(str as ResultValue) ? (str as ResultValue) : "10";
}

/** პროცენტები სლაიდერის step-ის მიხედვით (0.2–1.0 → 20–100, step 0.05) */
export const THRESHOLD_PERCENT_VALUES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100] as const;
export type ThresholdPercent = (typeof THRESHOLD_PERCENT_VALUES)[number];

/** nuqs-ისთვის უნდა იყოს ვალიდური მნიშვნელობა; ახლომდებარე ვალიდური პროცენტის დაბრუნება */
export function snapThreshold(percent: number): ThresholdPercent {
  return THRESHOLD_PERCENT_VALUES.reduce((prev, curr) =>
    Math.abs(curr - percent) < Math.abs(prev - percent) ? curr : prev
  );
}

export const RESULT_OPTIONS = RESULT_VALUES.map((v) => ({
  value: v,
  label: `${v} შედეგი`,
}));

export function LawType() {
  const [law, setLaw] = useQueryState(
    "law",
    parseAsStringLiteral(LAW_VALUES).withDefault("__all__")
  );
  return [law, setLaw] as const;
}

export function Results() {
  const [result, setResult] = useQueryState(
    "total-result",
    parseAsStringLiteral(RESULT_VALUES).withDefault("10")
  );
  return [result, setResult] as const;
}

/** მინიმალური შესაბამისობა პროცენტებში (20–100). URL: ?threshold=65 */
export function ScoreThreshold() {
  const [percent, setPercent] = useQueryState(
    "threshold",
    parseAsNumberLiteral(THRESHOLD_PERCENT_VALUES).withDefault(40)
  );
  return [percent, setPercent] as const;
}
