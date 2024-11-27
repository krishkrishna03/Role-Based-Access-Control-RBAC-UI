import React, { useEffect, useState, useRef } from 'react';
import { Grid, Paper, Typography, CircularProgress, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import axios from '../utils/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the required components for Chart.js, including LinearScale
ChartJS.register(
  CategoryScale, 
  LinearScale, // Register LinearScale for Bar chart
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/users');
        const rolesResponse = await axios.get('/roles');
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Cleanup chart instances on re-render
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  // Data for Charts
  const roleDistribution = roles.map((role) => ({
    name: role.name,
    count: users.filter((user) => user.role.name === role.name).length,
  }));

  const roleChartData = {
    labels: roleDistribution.map((role) => role.name),
    datasets: [
      {
        label: 'Users per Role',
        data: roleDistribution.map((role) => role.count),
        backgroundColor: ['#3f51b5', '#ff5722', '#4caf50', '#ffc107', '#9c27b0'],
        borderWidth: 1,
      },
    ],
  };

  const statusDistribution = {
    active: users.filter((user) => user.status === 'active').length,
    inactive: users.filter((user) => user.status === 'inactive').length,
  };

  const statusChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [statusDistribution.active, statusDistribution.inactive],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#ef5350'],
      },
    ],
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  return (
    <Grid container spacing={4} sx={{ p: 3 }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>

      {/* Total Users and Roles */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">{users.length}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Roles
            </Typography>
            <Typography variant="h4">{roles.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Role Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Role Distribution
          </Typography>
          <Bar ref={barChartRef} data={roleChartData} options={{ responsive: true }} />
        </Paper>
      </Grid>

      {/* Status Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Status Distribution
          </Typography>
          <Pie ref={pieChartRef} data={statusChartData} options={{ responsive: true }} />
        </Paper>
      </Grid>

      {/* Detailed User List */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User List
          </Typography>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card sx={{ cursor: 'pointer' }} onClick={() => handleUserClick(user)}>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Role: {user.role.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {user.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* User Detail Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <Typography variant="h6">{selectedUser.name}</Typography>
              <Typography variant="body1">Email: {selectedUser.email}</Typography>
              <Typography variant="body1">Role: {selectedUser.role.name}</Typography>
              <Typography variant="body1">Status: {selectedUser.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default Dashboard;
