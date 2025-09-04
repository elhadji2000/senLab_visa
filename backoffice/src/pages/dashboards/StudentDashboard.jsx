import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { fetchClasses } from "../../api/classes";
import { fetchEleves, countElevesParClasse } from "../../api/student.api";
import { fetchUsers } from "../../api/users.api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [elevesParClasse, setElevesParClasse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities] = useState([
    {
      id: 1,
      action: "Nouvel élève inscrit",
      time: "Il y a 5 min",
      classe: "6ème A",
    },
    {
      id: 2,
      action: "Utilisateur modifié",
      time: "Il y a 12 min",
      user: "M. Dupont",
    },
    { id: 3, action: "Note ajoutée", time: "Il y a 30 min", classe: "4ème B" },
    {
      id: 4,
      action: "Absence signalée",
      time: "Il y a 45 min",
      eleve: "Jean Martin",
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Charger les données en parallèle
        const [usersRes, elevesRes, classesRes, elevesParClasseRes] =
          await Promise.all([
            fetchUsers(),
            fetchEleves(),
            fetchClasses(),
            countElevesParClasse(),
          ]);

        setUsers(usersRes.data);
        setEleves(elevesRes.data);
        setClasses(classesRes.data);

        // Gérer la réponse des élèves par classe
        if (Array.isArray(elevesParClasseRes.data)) {
          setElevesParClasse(elevesParClasseRes.data);
        } else if (
          elevesParClasseRes.data &&
          Array.isArray(elevesParClasseRes.data.data)
        ) {
          setElevesParClasse(elevesParClasseRes.data.data);
        } else {
          setElevesParClasse([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
    "#FF4560",
    "#0088FE",
    "#00C49F",
  ];

  // Calculer les statistiques
  const profCount = users.filter((user) => user.role === "professeur").length;
  const adminCount = users.filter(
    (user) => user.role === "administrateur"
  ).length;

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Box sx={{ width: "80%", maxWidth: 400 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Chargement des données...
          </Typography>
          <LinearProgress />
        </Box>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          📊 Tableau de Bord Administrateur
        </Typography>
        <Chip
          icon={<NotificationsIcon />}
          label="3 nouvelles notifications"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Statistiques principales */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" color="textSecondary">
                  Utilisateurs
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" mb={1}>
                {users.length}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">
                  {profCount} Professeurs
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {adminCount} Admins
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon color="secondary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" color="textSecondary">
                  Élèves
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {eleves.length}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Moyenne:{" "}
                {classes.length > 0
                  ? Math.round(eleves.length / classes.length)
                  : 0}{" "}
                par classe
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ClassIcon color="success" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" color="textSecondary">
                  Classes
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {classes.length}
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {elevesParClasse.length} avec élèves inscrits
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 2, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="warning" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" color="textSecondary">
                  Activité
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                24
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Actions cette semaine
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques et données détaillées */}
      <Grid container spacing={3}>
        {/* Graphique élèves par classe */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom color="primary">
              📈 Répartition des élèves par classe
            </Typography>
            <div style={{ height: "300px" }}>
              {elevesParClasse.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={elevesParClasse}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="classe" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Nombre d'élèves"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Typography color="textSecondary">
                    Aucune donnée disponible
                  </Typography>
                </Box>
              )}
            </div>
          </Card>
        </Grid>

        {/* Graphique circulaire */}
        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom color="primary">
              🎯 Répartition des utilisateurs
            </Typography>
            <div style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Professeurs", value: profCount },
                      { name: "Administrateurs", value: adminCount },
                      { name: "Élèves", value: eleves.length },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {[profCount, adminCount, eleves.length].map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid>

        {/* Activités récentes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              📋 Activités récentes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Action</TableCell>
                    <TableCell>Détails</TableCell>
                    <TableCell>Heure</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>
                        {activity.classe ||
                          activity.user ||
                          activity.eleve ||
                          "-"}
                      </TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Liste des classes */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              🏫 Liste des classes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Classe</TableCell>
                    <TableCell>Nombre d'élèves</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {elevesParClasse.slice(0, 5).map((classe, index) => (
                    <TableRow key={index}>
                      <TableCell>{classe.classe}</TableCell>
                      <TableCell>{classe.count}</TableCell>
                      <TableCell>
                        <Chip
                          label={classe.count > 0 ? "Active" : "Vide"}
                          color={classe.count > 0 ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminDashboard;
