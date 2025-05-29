import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Chip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button
} from '@mui/material';
import { Search as SearchIcon, FilterList, Close } from '@mui/icons-material';
import './Explorer.css';

function Explorer() {
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/simulations`);
                setSimulations(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSimulations();
    }, []);

    const filteredSimulations = simulations.filter(simulation => {
        const matchesSearch = simulation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            simulation.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? simulation.categorie === categoryFilter : true;
        const matchesLevel = levelFilter ? simulation.niveau === levelFilter : true;

        return matchesSearch && matchesCategory && matchesLevel;
    });

    const handleSimulationClick = async (simulationId) => {
        try {
            // Extraire le ZIP et obtenir le chemin HTML
            const response = await axios.get(`${API_BASE_URL}/api/simulations/${simulationId}/archive`);

            if (response.data.success) {
                // Ouvrir dans un nouvel onglet
                window.open(`${API_BASE_URL}/api/simulations/html/${simulationId}`, '_blank');
            } else {
                setError("Impossible de charger la simulation");
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError(err.message);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setLevelFilter('');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} thickness={4} sx={{ color: '#3f51b5' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error" variant="h6">
                    Erreur lors du chargement: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" className="explorer-container" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center"
                className="explorer-title" sx={{ mb: 4, fontWeight: 800 }}>
                Explorez Nos Simulations
            </Typography>

            {/* Filtres et recherche */}
            <Box className="filter-container" sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Rechercher une simulation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                            sx: { borderRadius: '12px' }
                        }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        sx={{ borderRadius: '12px', px: 3 }}
                    >
                        Filtres
                    </Button>
                    {(searchTerm || categoryFilter || levelFilter) && (
                        <Button
                            variant="text"
                            startIcon={<Close />}
                            onClick={resetFilters}
                            sx={{ color: 'text.secondary' }}
                        >
                            Réinitialiser
                        </Button>
                    )}
                </Box>

                {filtersOpen && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pt: 2 }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Catégorie"
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="">Toutes les catégories</MenuItem>
                                <MenuItem value="Mathematique">Mathématique</MenuItem>
                                <MenuItem value="Physique">Physique</MenuItem>
                                <MenuItem value="Chimie">Chimie</MenuItem>
                                <MenuItem value="Biologie">Biologie</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Niveau scolaire</InputLabel>
                            <Select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                label="Niveau"
                                sx={{ borderRadius: '12px' }}
                            >
                                <MenuItem value="">Tous les niveaux</MenuItem>
                                <MenuItem value="6e">6ème</MenuItem>
                                <MenuItem value="5e">5ème</MenuItem>
                                <MenuItem value="4e">4ème</MenuItem>
                                <MenuItem value="3e">3ème</MenuItem>
                                <MenuItem value="2nde">2nde</MenuItem>
                                <MenuItem value="1ère">1ère</MenuItem>
                                <MenuItem value="Terminale">Terminale</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </Box>

            {/* Liste des simulations */}
            {filteredSimulations.length === 0 ? (
                <Box className="empty-message" textAlign="center">
                    <Typography variant="h6" color="textSecondary">
                        Aucune simulation ne correspond à vos critères
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={resetFilters}
                        sx={{ mt: 2, borderRadius: '12px' }}
                    >
                        Réinitialiser les filtres
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {filteredSimulations.map((simulation, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={simulation._id}
                            style={{ '--index': index }} className="grid-item">
                            <Card
                                className="simulation-card"
                                onClick={() => handleSimulationClick(simulation._id)}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                    position: 'relative',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 4,
                                        background: 'linear-gradient(to right, #3f51b5, #2196f3)'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={`${API_BASE_URL}${simulation.photo}`}
                                    alt={simulation.titre}
                                    className="simulation-image"
                                    sx={{
                                        height: 200,
                                        objectFit: 'cover',
                                        width: '100%'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x200?text=Image+non+disponible';
                                    }}
                                />
                                <CardContent className="simulation-content" sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h2"
                                        sx={{ fontWeight: 600, mb: 1 }}>
                                        {simulation.titre}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                        sx={{
                                            mb: 2, display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                        {simulation.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto', flexWrap: 'wrap' }}>
                                        <Chip
                                            label={simulation.categorie}
                                            className="simulation-badge"
                                            sx={{
                                                backgroundColor: '#3f51b5',
                                                color: 'white'
                                            }}
                                        />
                                        <Chip
                                            label={simulation.niveau}
                                            className="simulation-badge"
                                            sx={{
                                                backgroundColor: '#2196f3',
                                                color: 'white'
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Explorer;