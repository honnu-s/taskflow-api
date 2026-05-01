const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

module.exports = router;
