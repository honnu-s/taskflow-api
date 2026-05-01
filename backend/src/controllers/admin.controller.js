const User = require('../models/user.model');
const Task = require('../models/task.model');

// GET /api/v1/admin/users - Admin: list all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/v1/admin/stats - Admin: system stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data: { totalUsers, totalTasks, tasksByStatus } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/v1/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await Task.deleteMany({ user: req.params.id });
    res.json({ success: true, message: 'User and their tasks deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
