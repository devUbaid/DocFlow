const { Router } = require('express');
const doc = require('../controllers/documentController');
const shareCtrl = require('../controllers/shareController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createDocSchema, updateDocSchema, shareDocSchema } = require('../validators');
const upload = require('../middleware/upload');

const router = Router();

router.use(protect);

router.post('/', validate(createDocSchema), doc.create);
router.get('/owned', doc.listOwned);
router.get('/shared', doc.listShared);
router.get('/:id', doc.getById);
router.patch('/:id', validate(updateDocSchema), doc.update);
router.delete('/:id', doc.remove);

router.post('/upload', upload.single('file'), doc.uploadFile);

router.post('/:id/share', validate(shareDocSchema), shareCtrl.share);
router.get('/:id/shares', shareCtrl.getShares);
router.delete('/:id/shares/:shareId', shareCtrl.removeShare);

module.exports = router;
