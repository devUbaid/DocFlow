const Document = require('../models/Document');
const Share = require('../models/Share');
const ApiError = require('../utils/ApiError');

const create = async (ownerId, data = {}) => {
  const doc = await Document.create({ ...data, owner: ownerId });
  return doc;
};

const getById = async (docId, userId) => {
  const doc = await Document.findById(docId)
    .populate('owner', 'name email avatar')
    .populate('lastEditedBy', 'name email avatar');
  if (!doc) throw ApiError.notFound('Document not found');

  const isOwner = doc.owner._id.toString() === userId.toString();
  const share = await Share.findOne({ document: docId, sharedWith: userId });
  if (!isOwner && !share) throw ApiError.forbidden('No access to this document');

  return { doc, permission: isOwner ? 'owner' : share.permission };
};

const listOwned = async (userId) => {
  return Document.find({ owner: userId })
    .populate('owner', 'name email avatar')
    .sort({ updatedAt: -1 })
    .lean();
};

const listSharedWithMe = async (userId) => {
  const shares = await Share.find({ sharedWith: userId })
    .populate({
      path: 'document',
      populate: { path: 'owner', select: 'name email avatar' },
    })
    .sort({ createdAt: -1 })
    .lean();

  return shares
    .filter((s) => s.document)
    .map((s) => ({
      ...s.document,
      sharePermission: s.permission,
      sharedAt: s.createdAt,
    }));
};

const update = async (docId, userId, data) => {
  const doc = await Document.findById(docId);
  if (!doc) throw ApiError.notFound('Document not found');

  const isOwner = doc.owner.toString() === userId.toString();
  const share = await Share.findOne({ document: docId, sharedWith: userId });

  if (!isOwner && (!share || share.permission !== 'edit')) {
    throw ApiError.forbidden('No edit access');
  }

  if (data.title !== undefined) doc.title = data.title;
  if (data.content !== undefined) doc.content = data.content;
  doc.lastEditedBy = userId;
  await doc.save();

  return Document.findById(docId)
    .populate('owner', 'name email avatar')
    .populate('lastEditedBy', 'name email avatar');
};

const remove = async (docId, userId) => {
  const doc = await Document.findById(docId);
  if (!doc) throw ApiError.notFound('Document not found');
  if (doc.owner.toString() !== userId.toString()) {
    throw ApiError.forbidden('Only the owner can delete');
  }

  await Share.deleteMany({ document: docId });
  await doc.deleteOne();
};

const createFromFile = async (ownerId, filename, textContent) => {
  const title = filename.replace(/\.(txt|md)$/i, '');
  return Document.create({ title, content: textContent, owner: ownerId });
};

module.exports = { create, getById, listOwned, listSharedWithMe, update, remove, createFromFile };
