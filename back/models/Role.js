import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  resource: String,
  actions: [{
    type: String,
    enum: ['create', 'read', 'update', 'delete']
  }]
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  permissions: [permissionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Role', roleSchema);