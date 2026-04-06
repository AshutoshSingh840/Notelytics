const RATING_TO_SCORE = {
  again: 0,
  hard: 0.35,
  good: 0.75,
  easy: 1,
};

const DIFFICULTY_BIAS = {
  easy: 0.08,
  medium: 0,
  hard: -0.08,
};

const DIFFICULTY_INTERVAL_FACTOR = {
  easy: 1.15,
  medium: 1,
  hard: 0.85,
};

const BASE_INTERVAL_DAYS = {
  again: 1,
  hard: 2,
  good: 4,
  easy: 7,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const sigmoid = (z) => 1 / (1 + Math.exp(-z));

const toDaysSince = (dateValue, now) => {
  if (!dateValue) return 30;
  const ms = now.getTime() - new Date(dateValue).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 0;
  return ms / (1000 * 60 * 60 * 24);
};

const weightedRecentMean = (events) => {
  if (!events.length) return 0;
  let weightedSum = 0;
  let totalWeight = 0;
  const decay = 0.75;

  for (let i = events.length - 1, age = 0; i >= 0; i -= 1, age += 1) {
    const rating = events[i]?.rating || "again";
    const score = RATING_TO_SCORE[rating] ?? 0;
    const weight = Math.pow(decay, age);
    weightedSum += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

const scoreConsistency = (events) => {
  if (events.length <= 1) return 0.5;
  const values = events.map((item) => RATING_TO_SCORE[item?.rating] ?? 0);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  return clamp(1 - std / 0.5, 0, 1);
};

const speedScore = (avgResponseTimeMs) => {
  if (!Number.isFinite(avgResponseTimeMs) || avgResponseTimeMs <= 0) return 0.5;
  return clamp(1 - (avgResponseTimeMs - 4000) / 21000, 0, 1);
};

const repetitionScore = (reviewCount) => {
  const normalized = Math.log1p(Math.max(reviewCount, 0)) / Math.log(12);
  return clamp(normalized, 0, 1);
};

const recencyScore = (daysSinceLastReview) => {
  return clamp(Math.exp(-daysSinceLastReview / 10), 0, 1);
};

const computeAverageResponseTime = (events) => {
  const valid = events
    .map((item) => Number(item?.responseTimeMs))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!valid.length) return 0;
  return Math.round(valid.reduce((sum, value) => sum + value, 0) / valid.length);
};

export const buildMasteryUpdate = ({
  card,
  rating = "good",
  responseTimeMs = 0,
  now = new Date(),
}) => {
  const safeRating = RATING_TO_SCORE[rating] !== undefined ? rating : "good";
  const safeResponseTimeMs = Number.isFinite(responseTimeMs) && responseTimeMs > 0
    ? Math.round(responseTimeMs)
    : 0;
  const difficulty = (card?.difficulty || "medium").toLowerCase();

  const historicalEvents = Array.isArray(card?.reviewEvents) ? card.reviewEvents : [];
  const recentEvents = [...historicalEvents.slice(-24), {
    reviewedAt: now,
    rating: safeRating,
    responseTimeMs: safeResponseTimeMs,
  }];

  const recentMean = weightedRecentMean(recentEvents);
  const consistency = scoreConsistency(recentEvents);
  const avgResponseTimeMs = computeAverageResponseTime(recentEvents.slice(-12));
  const pace = speedScore(avgResponseTimeMs);
  const repetition = repetitionScore((card?.reviewCount || 0) + 1);
  const daysSinceLastReview = toDaysSince(card?.lastReviewed, now);
  const recency = recencyScore(daysSinceLastReview);
  const difficultyBias = DIFFICULTY_BIAS[difficulty] ?? 0;

  const z =
    -1.1 +
    1.8 * recentMean +
    0.8 * repetition +
    0.5 * consistency +
    0.4 * pace +
    0.35 * recency +
    difficultyBias;

  const masteryScore = clamp(sigmoid(z), 0, 1);
  const confidence = clamp(0.35 + 0.65 * Math.min(recentEvents.length / 12, 1), 0.35, 1);

  const baseInterval = BASE_INTERVAL_DAYS[safeRating] ?? 4;
  const intervalMultiplier = 0.7 + masteryScore * 1.8;
  const difficultyFactor = DIFFICULTY_INTERVAL_FACTOR[difficulty] ?? 1;
  const intervalDays = clamp(
    Math.round(baseInterval * intervalMultiplier * difficultyFactor),
    1,
    30
  );

  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    event: {
      reviewedAt: now,
      rating: safeRating,
      responseTimeMs: safeResponseTimeMs,
      predictedMastery: masteryScore,
    },
    masteryScore: Number(masteryScore.toFixed(4)),
    masteryConfidence: Number(confidence.toFixed(4)),
    avgResponseTimeMs,
    intervalDays,
    nextReviewAt,
  };
};

