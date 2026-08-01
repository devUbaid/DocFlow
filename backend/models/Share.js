const mongoose = require('mongoose');
const { SHARE_PERMISSIONS } = require('../constants');

const shareSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sharedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    permission: {
      type: String,
      enum: Object.values(SHARE_PERMISSIONS),
      default: SHARE_PERMISSIONS.VIEW,
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

shareSchema.index({ document: 1, sharedWith: 1 }, { unique: true });
shareSchema.index({ sharedWith: 1 });

module.exports = mongoose.model('Share', shareSchema);
