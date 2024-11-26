import Role from '../models/Role.js';
import User from '../models/User.js';

export async function initializeDb() {
  try {
    // Create admin role if it doesn't exist
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      const newAdminRole = await Role.create({
        name: 'admin',
        description: 'Administrator role with full access',
        permissions: [
          {
            resource: 'users',
            actions: ['create', 'read', 'update', 'delete']
          },
          {
            resource: 'roles',
            actions: ['create', 'read', 'update', 'delete']
          }
        ]
      });

      // Create admin user if it doesn't exist
      const adminUser = await User.findOne({ email: 'admin@example.com' });
      if (!adminUser) {
        await User.create({
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: newAdminRole._id,
          status: 'active'
        });
      }
    }

    console.log('Database initialized with admin user and role');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}