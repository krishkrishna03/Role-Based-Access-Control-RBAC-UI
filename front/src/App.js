import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RBACApp = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Users and Roles on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/roles')
        ]);
        
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // User Management Functions
  const addUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users', userData);
      setUsers([...users, response.data]);
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${updatedUser._id}`, updatedUser);
      setUsers(users.map(user => 
        user._id === updatedUser._id ? response.data : user
      ));
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  // Role Management Functions
  const addRole = async (roleData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/roles', roleData);
      setRoles([...roles, response.data]);
    } catch (err) {
      setError('Failed to add role');
      console.error(err);
    }
  };

  const updateRole = async (updatedRole) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/roles/${updatedRole._id}`, updatedRole);
      setRoles(roles.map(role => 
        role._id === updatedRole._id ? response.data : role
      ));
    } catch (err) {
      setError('Failed to update role');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">RBAC Management Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Users Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <UserManagement 
            users={users}
            roles={roles}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        </div>

        {/* Roles Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Role Management</h2>
          <RoleManagement 
            roles={roles}
            onAddRole={addRole}
            onUpdateRole={updateRole}
          />
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = ({ users, roles, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [newUser, setNewUser] = useState({ 
    username: '', 
    email: '', 
    roleId: '' 
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    onAddUser(newUser);
    setNewUser({ username: '', email: '', roleId: '' });
  };

  return (
    <div>
      <div className="mb-4">
        {users.map(user => (
          <div key={user._id} className="flex justify-between items-center p-2 border-b">
            <div>
              <span className="font-medium">{user.username}</span>
              <span className="text-gray-500 ml-2">({user.email})</span>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={user.roleId?._id || user.roleId || ''} 
                onChange={(e) => onUpdateUser({
                  ...user, 
                  roleId: e.target.value
                })}
                className="border rounded p-1"
              >
                {roles.map(role => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => onDeleteUser(user._id)} 
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="mt-4">
        <input 
          type="text" 
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
          className="w-full p-2 border rounded mb-2"
          required 
        />
        <input 
          type="email" 
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="w-full p-2 border rounded mb-2"
          required 
        />
        <select 
          value={newUser.roleId}
          onChange={(e) => setNewUser({...newUser, roleId: e.target.value})}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role._id} value={role._id}>{role.name}</option>
          ))}
        </select>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

// Role Management Component
const RoleManagement = ({ roles, onAddRole, onUpdateRole }) => {
  const [newRole, setNewRole] = useState({ 
    name: '', 
    permissions: [] 
  });

  const handleAddRole = (e) => {
    e.preventDefault();
    onAddRole(newRole);
    setNewRole({ name: '', permissions: [] });
  };

  const togglePermission = (permission) => {
    const currentPermissions = newRole.permissions;
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    
    setNewRole({...newRole, permissions: updatedPermissions});
  };

  const permissionOptions = [
    'read', 'write', 'delete', 'update'
  ];

  return (
    <div>
      <div className="mb-4">
        {roles.map(role => (
          <div key={role._id} className="flex justify-between items-center p-2 border-b">
            <div>
              <span className="font-medium">{role.name}</span>
              <div className="text-gray-500 mt-1">
                Permissions: {role.permissions.join(', ')}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateRole(role)} 
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Form */}
      <form onSubmit={handleAddRole} className="mt-4">
        <input 
          type="text" 
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
          className="w-full p-2 border rounded mb-2"
          required 
        />
        <div className="mb-4">
          <span className="font-semibold">Permissions</span>
          <div className="mt-2">
            {permissionOptions.map(permission => (
              <label key={permission} className="block">
                <input 
                  type="checkbox" 
                  checked={newRole.permissions.includes(permission)} 
                  onChange={() => togglePermission(permission)} 
                  className="mr-2"
                />
                {permission}
              </label>
            ))}
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Role
        </button>
      </form>
    </div>
  );
};

export default RBACApp;
