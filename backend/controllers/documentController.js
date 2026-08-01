const asyncHandler = require('../middleware/asyncHandler');
const documentService = require('../services/documentService');
const ApiError = require('../utils/ApiError');
const { ALLOWED_UPLOAD_TYPES } = require('../constants');
const path = require('path');
const fs = require('fs');

const create = asyncHandler(async (req, res) => {
  const doc = await documentService.create(req.user._id, req.body);
  res.status(201).json({ document: doc });
});

const getById = asyncHandler(async (req, res) => {
  const { doc, permission } = await documentService.getById(req.params.id, req.user._id);
  res.json({ document: doc, permission });
});

const listOwned = asyncHandler(async (req, res) => {
  const documents = await documentService.listOwned(req.user._id);
  res.json({ documents });
});

const listShared = asyncHandler(async (req, res) => {
  const documents = await documentService.listSharedWithMe(req.user._id);
  res.json({ documents });
});

const update = asyncHandler(async (req, res) => {
  const doc = await documentService.update(req.params.id, req.user._id, req.body);
  res.json({ document: doc });
});

const remove = asyncHandler(async (req, res) => {
  await documentService.remove(req.params.id, req.user._id);
  res.json({ message: 'Document deleted' });
});

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded');

  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!ALLOWED_UPLOAD_TYPES.includes(ext)) {
    if (req.file.path) fs.unlinkSync(req.file.path);
    throw ApiError.badRequest(`Unsupported file type. Allowed: ${ALLOWED_UPLOAD_TYPES.join(', ')}`);
  }

  const textContent = req.file.buffer.toString('utf-8');
  const doc = await documentService.createFromFile(
    req.user._id,
    req.file.originalname,
    textContent
  );
  res.status(201).json({ document: doc });
});

module.exports = { create, getById, listOwned, listShared, update, remove, uploadFile };
