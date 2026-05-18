const express = require('express');
const router  = express.Router();
const { protect, studentOnly }        = require('../middleware/authMiddleware');
const { getMyAttendance, getMyStats } = require('../controllers/studentController');

// All student routes are protected + student-only
router.use(protect, studentOnly);

router.get('/attendance', getMyAttendance);
router.get('/stats',      getMyStats);

module.exports = router;
