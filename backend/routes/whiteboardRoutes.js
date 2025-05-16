const express = require('express');
const router = express.Router();
const { getWhiteboards, getWhiteboardById, createWhiteboard, updateWhiteboard, deleteWhiteboard } = require('../controllers/whiteboardController');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validate');
const { whiteboardSchema } = require('../middleware/validateRequest');

router.get('/', protect, getWhiteboards);
router.get('/:id', protect, getWhiteboardById);
router.post('/', protect, validateBody(whiteboardSchema), createWhiteboard);
router.put('/:id', protect, validateBody(whiteboardSchema), updateWhiteboard);
router.delete('/:id', protect, deleteWhiteboard);

module.exports = router;