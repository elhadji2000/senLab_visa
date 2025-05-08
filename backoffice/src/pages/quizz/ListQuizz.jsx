import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  TablePagination,
  Avatar,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  Button, // Ajouté ici
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Quiz as QuizIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transition: 'background-color 0.2s ease',
  },
  '&.MuiTableRow-root': {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }
}));

const DifficultyChip = styled(Chip)(({ difficulty, theme }) => ({
  backgroundColor: 
    difficulty === 'Facile' ? theme.palette.success.main : 
    difficulty === 'Moyen' ? theme.palette.warning.main : theme.palette.error.main,
  color: 'white',
  fontWeight: 'bold',
  minWidth: 80,
  borderRadius: 4,
}));

const ListQuizz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes/all');
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des quizzes :", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAction = (action, quiz) => {
    console.log(`${action} quiz:`, quiz);
    // Implémentez vos actions ici (view, edit, delete)
  };

  // Version mobile - Card
  const MobileQuizItem = ({ quiz, index }) => (
    <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <QuizIcon />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {quiz.titre}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {quiz.description.length > 60 ? `${quiz.description.substring(0, 60)}...` : quiz.description}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <DifficultyChip label={quiz.niveau} difficulty={quiz.niveau} size="small" />
        <Chip 
          label={new Date(quiz.createdAt).toLocaleDateString()} 
          variant="outlined" 
          size="small"
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Tooltip title="Voir">
          <IconButton size="small" onClick={() => handleAction('view', quiz)}>
            <VisibilityIcon color="info" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Modifier">
          <IconButton size="small" onClick={() => handleAction('edit', quiz)}>
            <EditIcon color="primary" fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton size="small" onClick={() => handleAction('delete', quiz)}>
            <DeleteIcon color="error" fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 4,
        fontWeight: 'bold',
        color: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        fontSize: isMobile ? '1.5rem' : '2rem'
      }}>
        <QuizIcon fontSize="inherit" />
        Liste des Quizzes
      </Typography>

      {/* Barre de recherche et filtres */}
      <Paper elevation={2} sx={{ p: isMobile ? 1 : 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher un quiz..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size={isMobile ? 'small' : 'medium'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              fullWidth
              variant="outlined" 
              startIcon={<FilterListIcon />}
              size={isMobile ? 'small' : 'medium'}
            >
              Filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : isMobile ? (
        // Version mobile
        <Box>
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((quiz, index) => (
                <MobileQuizItem key={quiz.id} quiz={quiz} index={index} />
              ))
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              Aucun quiz trouvé
            </Typography>
          )}
          
          <TablePagination
            component="div"
            count={filteredQuizzes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes/page:"
            sx={{ mt: 2 }}
          />
        </Box>
      ) : (
        // Version desktop
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 60 }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: 120 }}>Niveau</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: 150 }}>Créé le</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: 150 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((quiz, index) => (
                      <StyledTableRow key={quiz.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <QuizIcon />
                          </Avatar>
                          <Typography variant="body1" fontWeight="medium">
                            {quiz.titre}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {quiz.description.length > 100 ? `${quiz.description.substring(0, 100)}...` : quiz.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <DifficultyChip 
                            label={quiz.niveau} 
                            difficulty={quiz.niveau}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={new Date(quiz.createdAt).toLocaleDateString()} 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Voir">
                              <IconButton color="info" onClick={() => handleAction('view', quiz)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifier">
                              <IconButton color="primary" onClick={() => handleAction('edit', quiz)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton color="error" onClick={() => handleAction('delete', quiz)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun quiz trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredQuizzes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
          />
        </Paper>
      )}
    </Box>
  );
};

export default ListQuizz;