import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({

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

  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },

    content: {
      type: String,
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    relevantChunks: {
      type: [Number],
      default: []
      // ⚠️ WARNING: No validation for valid chunk indexes
    }

  }]

}, {
  timestamps: true
});


// Index for faster queries
chatHistorySchema.index({ userId: 1, documentId: 1 });
// ⚠️ WARNING: Not unique — duplicate chat histories possible


const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
