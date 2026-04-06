import Flashcard from "../models/Flashcard.js";
import { logStudyActivity } from "../utils/studyActivity.js";
import { buildMasteryUpdate } from "../utils/masteryModel.js";

const REVIEW_RATINGS = new Set(["again", "hard", "good", "easy"]);

const normalizeReviewInput = (payload = {}) => {
  const rawRating = String(payload.rating || "good").toLowerCase();
  const rating = REVIEW_RATINGS.has(rawRating) ? rawRating : "good";
  const responseTimeMs = Number(payload.responseTimeMs);

  return {
    rating,
    responseTimeMs:
      Number.isFinite(responseTimeMs) && responseTimeMs > 0
        ? Math.round(responseTimeMs)
        : 0,
  };
};

// @desc    Get all flashcards for a document
// @route   GET /api/flashcards/:documentId
// @access  Private
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all flashcard sets for a user
// @route   GET /api/flashcards
// @access  Private
export const getAllFlashcardSets = async (req, res, next) => {
  try {
    const flashcardSets = await Flashcard.find({ userId: req.user._id })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get due flashcards across all sets
// @route   GET /api/flashcards/due
// @access  Private
export const getDueFlashcards = async (req, res, next) => {
  try {
    const now = new Date();
    const sets = await Flashcard.find({ userId: req.user._id })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    const dueCards = [];
    sets.forEach((setItem) => {
      setItem.cards.forEach((card) => {
        const nextReviewAt = card.nextReviewAt ? new Date(card.nextReviewAt) : null;
        const isDue = !nextReviewAt || nextReviewAt <= now;
        if (!isDue) return;

        dueCards.push({
          cardId: card._id,
          setId: setItem._id,
          documentId: setItem.documentId?._id || setItem.documentId,
          documentTitle: setItem.documentId?.title || "Document",
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty || "medium",
          reviewCount: card.reviewCount || 0,
          masteryScore: card.masteryScore || 0,
          masteryConfidence: card.masteryConfidence || 0,
          nextReviewAt: card.nextReviewAt || null,
        });
      });
    });

    dueCards.sort((a, b) => (a.masteryScore || 0) - (b.masteryScore || 0));

    res.status(200).json({
      success: true,
      count: dueCards.length,
      data: dueCards,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review flashcard and update mastery model
// @route   POST /api/flashcards/:cardId/review
// @access  Private
export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
        statusCode: 404,
      });
    }

    const { rating, responseTimeMs } = normalizeReviewInput(req.body);
    const now = new Date();
    const card = flashcardSet.cards[cardIndex];

    const modelUpdate = buildMasteryUpdate({
      card,
      rating,
      responseTimeMs,
      now,
    });

    card.lastReviewed = now;
    card.reviewCount += 1;
    card.reviewEvents.push(modelUpdate.event);
    card.reviewEvents = card.reviewEvents.slice(-40);
    card.masteryScore = modelUpdate.masteryScore;
    card.masteryConfidence = modelUpdate.masteryConfidence;
    card.avgResponseTimeMs = modelUpdate.avgResponseTimeMs;
    card.intervalDays = modelUpdate.intervalDays;
    card.nextReviewAt = modelUpdate.nextReviewAt;

    await flashcardSet.save();

    await logStudyActivity({
      userId: req.user._id,
      activityType: "flashcard_review",
    }).catch((activityError) => {
      console.error(
        "Failed to log flashcard review activity:",
        activityError.message
      );
    });

    res.status(200).json({
      success: true,
      data: flashcardSet,
      meta: {
        masteryScore: card.masteryScore,
        masteryConfidence: card.masteryConfidence,
        nextReviewAt: card.nextReviewAt,
        intervalDays: card.intervalDays,
      },
      message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle star on flashcard
// @route   PUT /api/flashcards/:cardId/star
// @access  Private
export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      "cards._id": req.params.cardId,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set or card not found",
        statusCode: 404,
      });
    }

    const cardIndex = flashcardSet.cards.findIndex(
      (card) => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Card not found in set",
        statusCode: 404,
      });
    }

    flashcardSet.cards[cardIndex].isStarred =
      !flashcardSet.cards[cardIndex].isStarred;

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${
        flashcardSet.cards[cardIndex].isStarred ? "starred" : "unstarred"
      }`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        error: "Flashcard set not found",
        statusCode: 404,
      });
    }

    await flashcardSet.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

