const asyncHandler = require('../middleware/asyncHandler');
const shareService = require('../services/shareService');

const share = asyncHandler(async (req, res) => {
  const result = await shareService.shareDocument(req.params.id, req.user._id, req.body);
  res.status(201).json({ share: result });
});

const getShares = asyncHandler(async (req, res) => {
  const shares = await shareService.getSharesForDoc(req.params.id, req.user._id);
  res.json({ shares });
});

const removeShare = asyncHandler(async (req, res) => {
  await shareService.removeShare(req.params.shareId, req.user._id);
  res.json({ message: 'Share removed' });
});

module.exports = { share, getShares, removeShare };
