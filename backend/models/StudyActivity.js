import mongoose from "mongoose";

const studyActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalActions: {
      type: Number,
      default: 0,
      min: 0,
    },
    actionCounts: {
      documentUploads: {
        type: Number,
        default: 0,
        min: 0,
      },
      documentViews: {
        type: Number,
        default: 0,
        min: 0,
      },
      flashcardReviews: {
        type: Number,
        default: 0,
        min: 0,
      },
      quizSubmissions: {
        type: Number,
        default: 0,
        min: 0,
      },
      chats: {
        type: Number,
        default: 0,
        min: 0,
      },
      aiActions: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

studyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });
studyActivitySchema.index({ userId: 1, date: -1 });

const StudyActivity = mongoose.model("StudyActivity", studyActivitySchema);

export default StudyActivity;
