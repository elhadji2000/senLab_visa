import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    quizzes: 0,
    simulations: 0,
    dailyProgress: [],
    quizCompletion: [],
    userGrowth: []
  });

  const API_BASE_URL = 'http://localhost:5000'; // Remplacez par votre URL backend

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des données principales
        const [summaryRes, progressRes, growthRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/dashboard/summary`),
          axios.get(`${API_BASE_URL}/api/dashboard/progress`),
          axios.get(`${API_BASE_URL}/api/dashboard/growth`)
        ]);

        setStats({
          users: summaryRes.data.totalUsers,
          activeUsers: summaryRes.data.activeUsers,
          quizzes: summaryRes.data.totalQuizzes,
          simulations: summaryRes.data.totalSimulations,
          dailyProgress: progressRes.data,
          userGrowth: growthRes.data,
          quizCompletion: [
            { name: 'Complétés', value: summaryRes.data.completedQuizzes },
            { name: 'En cours', value: summaryRes.data.inProgressQuizzes },
            { name: 'Non commencés', value: summaryRes.data.notStartedQuizzes }
          ]
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calcul des tendances (exemple)
  const calculateTrend = (current, previous) => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${Math.round(change)}%`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">Erreur: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 0, m: 0 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, width: '100%', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3, fontSize: '2.2rem', pt: 3 }}>
          Tableau de Bord SenLab - Statistiques Complètes
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { 
              title: 'Utilisateurs Totaux', 
              value: stats.users, 
              change: calculateTrend(stats.users, stats.users * 0.82), // Exemple: +18%
              color: theme.palette.primary.main 
            },
            { 
              title: 'Utilisateurs Actifs', 
              value: stats.activeUsers, 
              change: calculateTrend(stats.activeUsers, stats.activeUsers * 0.88), // Exemple: +12%
              color: theme.palette.success.main 
            },
            { 
              title: 'Quizzes', 
              value: stats.quizzes, 
              change: `+${stats.quizzes - Math.round(stats.quizzes * 0.92)} nouveaux`, // Exemple: +8
              color: theme.palette.warning.main 
            },
            { 
              title: 'Simulations', 
              value: stats.simulations, 
              change: `+${stats.simulations - Math.round(stats.simulations * 0.89)} nouvelles`, // Exemple: +5
              color: theme.palette.info.main 
            }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ flex: 1 }}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, borderLeft: `4px solid ${item.color}`, height: '100%' }}>
                <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>{item.title}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: item.color }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: item.color, fontWeight: 500 }}>
                  {item.change}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Graphiques */}
        <Grid container spacing={3} sx={{ mb: 2, width: '100%', margin: 0 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', padding: '0 !important', width: '50%' }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '450px', display: 'flex', flexDirection: 'column', flex: 1, width: '100%', marginRight: '8px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Activité Hebdomadaire</Typography>
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.dailyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: theme.shadows[3], border: 'none' }} />
                    <Legend />
                    <Bar dataKey="utilisateurs" fill="#6366f1" name="Utilisateurs" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quizzes" fill="#10b981" name="Quizzes complétés" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="simulations" fill="#f59e0b" name="Simulations" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', padding: '0 !important', width: '45%' }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '450px', display: 'flex', flexDirection: 'column', flex: 1, width: '100%', marginLeft: '8px' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Croissance des Utilisateurs</Typography>
              <Box sx={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: theme.shadows[3], border: 'none' }} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8b5cf6" name="Utilisateurs" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Graphique Pie pour la complétion des quizzes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Statut des Quizzes</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={stats.quizCompletion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.quizCompletion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;