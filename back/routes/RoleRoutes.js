import express from 'express';
import Role from '../models/Role.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all roles
router.get('/', auth, async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create role
router.post('/', auth, async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update role
router.put('/:id', auth, async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete role
router.delete('/:id', auth, async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;