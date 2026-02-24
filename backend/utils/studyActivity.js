import StudyActivity from "../models/StudyActivity.js";

const ACTIVITY_COUNTER_MAP = {
  document_upload: "actionCounts.documentUploads",
  document_view: "actionCounts.documentViews",
  flashcard_review: "actionCounts.flashcardReviews",
  quiz_submission: "actionCounts.quizSubmissions",
  chat: "actionCounts.chats",
  ai_action: "actionCounts.aiActions",
};

export const getUtcDayStart = (dateInput = new Date()) => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

export const toDateKey = (dateInput) => {
  const dayStart = getUtcDayStart(dateInput);
  return dayStart ? dayStart.toISOString().slice(0, 10) : null;
};

export const getHeatmapLevel = (count) => {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
};

export const logStudyActivity = async ({
  userId,
  activityType,
  occurredAt = new Date(),
}) => {
  if (!userId || !activityType) return null;

  const dayStart = getUtcDayStart(occurredAt);
  if (!dayStart) return null;

  const counterPath = ACTIVITY_COUNTER_MAP[activityType];
  if (!counterPath) return null;

  return StudyActivity.findOneAndUpdate(
    { userId, date: dayStart },
    {
      $inc: {
        totalActions: 1,
        [counterPath]: 1,
      },
      $set: {
        lastActivityAt: new Date(occurredAt),
      },
      $setOnInsert: {
        userId,
        date: dayStart,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};
