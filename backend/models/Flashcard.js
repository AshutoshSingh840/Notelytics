import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    cards: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },

        lastReviewed: {
          type: Date,
          default: null,
        },

        reviewCount: {
          type: Number,
          default: 0,
          min: 0,
        },

        isStarred: {
          type: Boolean,
          default: false,
        },

        masteryScore: {
          type: Number,
          default: 0.25,
          min: 0,
          max: 1,
        },

        masteryConfidence: {
          type: Number,
          default: 0.35,
          min: 0,
          max: 1,
        },

        avgResponseTimeMs: {
          type: Number,
          default: 0,
          min: 0,
        },

        intervalDays: {
          type: Number,
          default: 1,
          min: 1,
        },

        nextReviewAt: {
          type: Date,
          default: Date.now,
        },

        reviewEvents: [
          {
            reviewedAt: {
              type: Date,
              default: Date.now,
            },
            rating: {
              type: String,
              enum: ["again", "hard", "good", "easy"],
              default: "good",
            },
            responseTimeMs: {
              type: Number,
              default: 0,
              min: 0,
            },
            predictedMastery: {
              type: Number,
              default: 0,
              min: 0,
              max: 1,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

flashcardSchema.index({ userId: 1, documentId: 1 });
flashcardSchema.index({ userId: 1, "cards.nextReviewAt": 1 });
flashcardSchema.index({ userId: 1, "cards.masteryScore": 1 });

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;

