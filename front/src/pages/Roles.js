import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import axios from '../utils/axios';

const RESOURCES = ['users', 'roles'];
const ACTIONS = ['create', 'read', 'update', 'delete'];

function Roles() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleOpen = (role = null) => {
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions
      });
    } else {
      setSelectedRole(null);
      setFormData({
        name: '',
        description: '',
        permissions: RESOURCES.map(resource => ({
          resource,
          actions: []
        }))
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
  };

  const handlePermissionChange = (resource, action) => {
    setFormData(prev => {
      const permissions = [...prev.permissions];
      const resourceIndex = permissions.findIndex(p => p.resource === resource);
      
      if (resourceIndex === -1) {
        permissions.push({
          resource,
          actions: [action]
        });
      } else {
        const actions = permissions[resourceIndex].actions;
        const actionIndex = actions.indexOf(action);
        
        if (actionIndex === -1) {
          actions.push(action);
        } else {
          actions.splice(actionIndex, 1);
        }
      }
      
      return { ...prev, permissions };
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedRole) {
        await axios.put(`/roles/${selectedRole._id}`, formData);
      } else {
        await axios.post('/roles', formData);
      }
      fetchRoles();
      handleClose();
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const hasPermission = (permissions, resource, action) => {
    const permission = permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Role
      </Button>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {role.permissions.map(p => (
                    <div key={p.resource}>
                      {p.resource}: {p.actions.join(', ')}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(role)}>Edit</Button>
                  <Button color="error" onClick={() => handleDelete(role._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {RESOURCES.map(resource => (
              <Grid item xs={12} key={resource}>
                <Paper sx={{ p: 2 }}>
                  <h4>{resource}</h4>
                  {ACTIONS.map(action => (
                    <FormControlLabel
                      key={action}
                      control={
                        <Checkbox
                          checked={hasPermission(formData.permissions, resource, action)}
                          onChange={() => handlePermissionChange(resource, action)}
                        />
                      }
                      label={action}
                    />
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Roles;