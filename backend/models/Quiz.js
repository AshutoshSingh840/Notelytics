import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  questions: [{
    question: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      required: true,
      validate: [
        array => array.length === 4,
        'Must have exactly 4 options'
      ]
      // ⚠️ WARNING: This does NOT validate that options are non-empty strings
    },

    correctAnswer: {
      type: String,
      required: true
      // ⚠️ WARNING: Not validated that it matches one of the 4 options
    },

    explanation: {
      type: String,
      default: ''
    },

    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
      // ⚠️ WARNING: No required: true (allowed to be undefined before default)
    }

  }],

  userAnswers: [{
    questionIndex: {
      type: Number,
      required: true
      // ⚠️ WARNING: No validation for index range
    },

    selectedAnswer: {
      type: String,
      required: true
    },

    isCorrect: {
      type: Boolean,
      required: true
    },

    answeredAt: {
      type: Date,
      default: Date.now
      // ⚠️ WARNING: Date.now is correct usage (no error here)
    }

  }],

  score: {
    type: Number,
    default: 0
    // ⚠️ WARNING: No validation (could be negative)
  },

  totalQuestions: {
    type: Number,
    required: true
  },

  completedAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});


// Index for faster queries
quizSchema.index({ userId: 1, documentId: 1 });
// ⚠️ WARNING: No unique constraint — duplicates allowed


const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
