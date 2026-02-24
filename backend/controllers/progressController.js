import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import StudyActivity from "../models/StudyActivity.js";
import {
  getHeatmapLevel,
  getUtcDayStart,
  toDateKey,
} from "../utils/studyActivity.js";

const EMPTY_ACTION_COUNTS = {
  documentUploads: 0,
  documentViews: 0,
  flashcardReviews: 0,
  quizSubmissions: 0,
  chats: 0,
  aiActions: 0,
};

const calculateCurrentStreak = (activityDaySet, todayStart) => {
  if (!todayStart || activityDaySet.size === 0) return 0;

  let streak = 0;
  const cursor = new Date(todayStart);

  while (true) {
    const dayKey = toDateKey(cursor);
    if (!dayKey || !activityDaySet.has(dayKey)) break;

    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

const calculateLongestStreak = (activities) => {
  if (!Array.isArray(activities) || activities.length === 0) return 0;

  const uniqueDayKeys = [...new Set(activities.map((item) => toDateKey(item.date)))]
    .filter(Boolean)
    .sort();

  if (uniqueDayKeys.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDayKeys.length; i += 1) {
    const prev = new Date(`${uniqueDayKeys[i - 1]}T00:00:00.000Z`);
    const curr = new Date(`${uniqueDayKeys[i]}T00:00:00.000Z`);
    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }

  return longest;
};

// @desc    Get user learning statistics
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todayStart = getUtcDayStart(new Date());

    // Get counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSets = await Flashcard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null },
    });

    // Get flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter((c) => c.reviewCount > 0).length;
      starredFlashcards += set.cards.filter((c) => c.isStarred).length;
    });

    // Get quiz statistics
    const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
          )
        : 0;

    // Recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select("title fileName lastAccessed status");

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions completedAt");

    // Real streak data based on logged daily activity
    const streakStart = new Date(todayStart);
    streakStart.setUTCDate(streakStart.getUTCDate() - 365);

    const streakActivities = await StudyActivity.find({
      userId,
      date: { $gte: streakStart, $lte: todayStart },
      totalActions: { $gt: 0 },
    })
      .sort({ date: 1 })
      .select("date totalActions");

    const activityDaySet = new Set(
      streakActivities.map((item) => toDateKey(item.date)).filter(Boolean)
    );

    const studyStreak = calculateCurrentStreak(activityDaySet, todayStart);
    const longestStudyStreak = calculateLongestStreak(streakActivities);

    // 30-day heatmap payload
    const heatmapStart = new Date(todayStart);
    heatmapStart.setUTCDate(heatmapStart.getUTCDate() - 29);

    const heatmapActivities = await StudyActivity.find({
      userId,
      date: { $gte: heatmapStart, $lte: todayStart },
    })
      .sort({ date: 1 })
      .select("date totalActions actionCounts");

    const heatmapByDay = new Map(
      heatmapActivities.map((entry) => [toDateKey(entry.date), entry])
    );

    const heatmap = [];
    for (let offset = 0; offset < 30; offset += 1) {
      const date = new Date(heatmapStart);
      date.setUTCDate(heatmapStart.getUTCDate() + offset);
      const dayKey = toDateKey(date);
      const dayEntry = heatmapByDay.get(dayKey);
      const totalActions = dayEntry?.totalActions || 0;

      heatmap.push({
        date: dayKey,
        totalActions,
        level: getHeatmapLevel(totalActions),
        actionCounts: dayEntry?.actionCounts || EMPTY_ACTION_COUNTS,
      });
    }

    const todayKey = toDateKey(todayStart);
    const todayActions = heatmapByDay.get(todayKey)?.totalActions || 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          studyStreak,
          longestStudyStreak,
          todayActions,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
          studyActivity: {
            heatmapStart: toDateKey(heatmapStart),
            heatmapEnd: toDateKey(todayStart),
            heatmap,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};