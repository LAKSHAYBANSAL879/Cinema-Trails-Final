import React, { useEffect, useState } from 'react';
import movieCollage from '../../assets/movieCollage.jpg';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import {
  Box, Grid, Paper, Typography, Card, CardContent,
  List, ListItem, ListItemText, Avatar, Button
} from '@mui/material';
import { styled } from '@mui/system';
import {
  MovieFilter, EventSeat, AttachMoney,
  Theaters, TrendingUp, Group, Today
} from '@mui/icons-material';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '15px',
  boxShadow: '0 3px 5px 2px rgba(25, 118, 210, 0.1)',
  background: 'linear-gradient(45deg, #E3F2FD 30%, #BBDEFB 90%)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
  color: 'white',
  borderRadius: '15px',
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    ticketsSold: 0,
    revenue: 0,
    movies: 0,
    customers: 0,
    monthlyData: [],
    topMovies: [],
    topCustomers: [],
    upcomingMovies: [],
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);


  const fetchStats = async () => {
    const { data: bookings } = await axios.get('https://cinema-trails.onrender.com/api/v1/bookings/getAllBookings');
    const { data: movies } = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getAllMovies');
    const { data: users } = await axios.get('https://cinema-trails.onrender.com/api/v1/auth/getAllUsers');
    const { data: topCustomers } = await axios.get('https://cinema-trails.onrender.com/api/v1/auth/getTopCustomers');
    const { data: topMovies } = await axios.get('https://cinema-trails.onrender.com/api/v1/movies/getTopMovies');
    console.log(bookings);
    // Calculate total tickets sold and total revenue
    const totalTicketsSold = bookings.reduce((total, booking) => total + booking.totalTickets, 0);
    const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
    const monthlyData = bookings.reduce((acc, booking) => {
      const month = new Date(booking.bookedAt).toLocaleString('default', { month: 'short' });
      const found = acc.find(data => data.month === month);

      if (found) {
        found.sales += booking.totalTickets;
        found.revenue += booking.totalPrice;
      } else {
        acc.push({ month, sales: booking.totalTickets, revenue: booking.totalPrice });
      }

      return acc;
    }, []);

    const sortedMonthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      .map(month => monthlyData.find(data => data.month === month) || { month, sales: 0, revenue: 0 });
    setStats({
      ticketsSold: totalTicketsSold,
      revenue: totalRevenue,
      movies: movies.length,
      customers: users.length,
      monthlyData: sortedMonthlyData,
      topMovies: topMovies.map(movie => ({
        name: movie.name,
        amount: movie.totalTickets,
      })),
      topCustomers: topCustomers.map(customer => ({
        name: customer.name,
        amount: customer.totalSpent,
      })),
      upcomingMovies: [
        'Dune: Part Two',
        'Black Widow',
        'No Time to Die',
        'Top Gun: Maverick',
        'The Batman'
      ],
    });
  };

  const StatCard = ({ title, value, icon }) => (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center">
          {icon}
          <Box ml={2}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h4">{value.toLocaleString()}</Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );

  return (

    <Box sx={{ minHeight: '100vh', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976D2', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
        Cinema Trail Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Tickets Sold" value={stats.ticketsSold} icon={<EventSeat fontSize="large" />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Revenue (Rs)" value={stats.revenue} icon={<AttachMoney fontSize="large" />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Movies" value={stats.movies} icon={<MovieFilter fontSize="large" />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Customers" value={stats.customers} icon={<Group fontSize="large" />} />
        </Grid>
        <Grid item xs={12} md={8}>
          <StyledPaper>
            <Typography variant="h6">Monthly Sales and Revenue</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Tickets Sold" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (Rs)" />
              </LineChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6">Popular Movies</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.topMovies}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.topMovies.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6">Top Customers</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topCustomers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#1976D2" />
              </BarChart>
            </ResponsiveContainer>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6">Quick Stats</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Avg. Ticket Price" secondary={`Rs${(stats.revenue / stats.ticketsSold).toFixed(2)}`} />
                <Avatar sx={{ bgcolor: '#4CAF50' }}>
                  <AttachMoney />
                </Avatar>
              </ListItem>
              <ListItem>
                <ListItemText primary="Tickets per Customer" secondary={(stats.ticketsSold / stats.customers).toFixed(2)} />
                <Avatar sx={{ bgcolor: '#2196F3' }}>
                  <Group />
                </Avatar>
              </ListItem>
              <ListItem>
                <ListItemText primary="Revenue per Movie" secondary={`Rs${(stats.revenue / stats.movies).toFixed(2)}`} />
                <Avatar sx={{ bgcolor: '#FFC107' }}>
                  <MovieFilter />
                </Avatar>
              </ListItem>
            </List>
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          {/* <StyledPaper>
            <Typography variant="h6">Upcoming Movies</Typography>
            <Box display="flex" justifyContent="space-around" flexWrap="wrap">
              {stats.upcomingMovies.map((movie, index) => (
                <Button
                  key={index}
                  variant="contained"
                  startIcon={<Theaters />}
                  sx={{ margin: 1, background: 'linear-gradient(45deg, #FF5722 30%, #FFA726 90%)' }}
                >
                  {movie}
                </Button>
              ))}
            </Box>
          </StyledPaper> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;