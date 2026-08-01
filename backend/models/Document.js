const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled Document', trim: true },
    content: { type: String, default: '' },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
  }
);

documentSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
