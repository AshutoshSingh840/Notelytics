import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: [true, 'Please provide a document title'],
    trim: true
  },

  fileName: {
    type: String,
    required: true
  },

  filePath: {
    type: String,
    required: true
  },

  fileSize: {
    type: Number,
    required: true
    // ⚠️ WARNING: No min validation (can be negative)
  },

  extractedText: {
    type: String,
    default: ''
  },

  chunks: [{
    content: {
      type: String,
      required: true
    },

    pageNumber: {
      type: Number,
      default: 0
      // ⚠️ WARNING: No min validation (can be negative)
    },

    chunkIndex: {
      type: Number,
      required: true
      // ⚠️ WARNING: No unique constraint per document
    }
  }],

  uploadDate: {
    type: Date,
    default: Date.now
  },

  lastAccessed: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing'
    // ⚠️ WARNING: Not required explicitly (though default covers it)
  }

}, {
  timestamps: true
});


// Index for faster queries
documentSchema.index({ userId: 1, uploadDate: -1 });
// ⚠️ WARNING: Not unique — duplicate documents allowed


const Document = mongoose.model('Document', documentSchema);

export default Document;
