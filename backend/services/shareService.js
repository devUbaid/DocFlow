const Share = require('../models/Share');
const Document = require('../models/Document');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { SHARE_PERMISSIONS } = require('../constants');

const shareDocument = async (docId, ownerId, { email, permission }) => {
  const doc = await Document.findById(docId);
  if (!doc) throw ApiError.notFound('Document not found');
  if (doc.owner.toString() !== ownerId.toString()) {
    throw ApiError.forbidden('Only the owner can share');
  }

  const targetUser = await User.findOne({ email });
  if (!targetUser) throw ApiError.notFound('User not found with that email');
  if (targetUser._id.toString() === ownerId.toString()) {
    throw ApiError.badRequest('Cannot share with yourself');
  }

  const existing = await Share.findOne({ document: docId, sharedWith: targetUser._id });
  if (existing) {
    existing.permission = permission || SHARE_PERMISSIONS.VIEW;
    await existing.save();
    return existing.populate('sharedWith', 'name email avatar');
  }

  const share = await Share.create({
    document: docId,
    owner: ownerId,
    sharedWith: targetUser._id,
    permission: permission || SHARE_PERMISSIONS.VIEW,
  });
  return share.populate('sharedWith', 'name email avatar');
};

const getSharesForDoc = async (docId, userId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw ApiError.notFound('Document not found');
  if (doc.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('Only the owner can view shares');
  }

  return Share.find({ document: docId }).populate('sharedWith', 'name email avatar').lean();
};

const removeShare = async (shareId, userId) => {
  const share = await Share.findById(shareId);
  if (!share) throw ApiError.notFound('Share not found');
  if (share.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('Only the owner can revoke sharing');
  }
  await share.deleteOne();
};

module.exports = { shareDocument, getSharesForDoc, removeShare };
