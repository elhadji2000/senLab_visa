import React, { useState, useEffect } from 'react';
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
import { fetchSimulations } from '../../api/simulationAPI';
import { Link, useNavigate } from 'react-router-dom';
import './Explorer.css';

function Explorer() {
    const [simulations, setSimulations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSimulations = async () => {
            try {
                const response = await fetchSimulations();
                setSimulations(response.data);
            } catch (err) {
                setError("Erreur lors du chargement des simulations");
            } finally {
                setLoading(false);
            }
        };

        loadSimulations();
    }, []);

    const filteredSimulations = simulations.filter((sim) => {
        const matchSearch =
            sim.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sim.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = categoryFilter ? sim.categorie === categoryFilter : true;
        const matchLevel = levelFilter ? sim.niveau === levelFilter : true;

        return matchSearch && matchCategory && matchLevel;
    });

    const resetFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setLevelFilter('');
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
                <Typography color="error" variant="h6">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                Explorez Nos Simulations
            </Typography>

            {/* Zone de recherche et filtres */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="Rechercher une simulation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1 }} />
                        }}
                    />
                    <Button variant="outlined" onClick={() => setFiltersOpen(!filtersOpen)} startIcon={<FilterList />}>
                        Filtres
                    </Button>
                    {(searchTerm || categoryFilter || levelFilter) && (
                        <Button variant="text" onClick={resetFilters} startIcon={<Close />}>
                            Réinitialiser
                        </Button>
                    )}
                </Box>

                {filtersOpen && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Catégorie</InputLabel>
                            <Select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                label="Catégorie"
                            >
                                <MenuItem value="">Toutes les catégories</MenuItem>
                                <MenuItem value="Mathematique">Mathématique</MenuItem>
                                <MenuItem value="Physique">Physique</MenuItem>
                                <MenuItem value="Chimie">Chimie</MenuItem>
                                <MenuItem value="Biologie">Biologie</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Niveau</InputLabel>
                            <Select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                label="Niveau"
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

            {/* Affichage des simulations */}
            {filteredSimulations.length === 0 ? (
                <Typography variant="h6" align="center" color="text.secondary">
                    Aucune simulation trouvée avec les filtres actuels.
                </Typography>
            ) : (
                <Grid container spacing={4}>
                    {filteredSimulations.map((simulation) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={simulation._id}>
                            <Link
                                to={`/simulations/view/${simulation._id}`}
                                style={{ textDecoration: 'none' }}
                                aria-label={`Voir la simulation ${simulation.titre}`}
                            >
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: 4
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={`http://localhost:5000${simulation.photo}`}
                                        alt={simulation.titre}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+non+disponible';
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom>{simulation.titre}</Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {simulation.description.length > 120
                                                ? simulation.description.substring(0, 117) + '...'
                                                : simulation.description}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip label={simulation.categorie} sx={{ backgroundColor: '#3f51b5', color: 'white' }} />
                                            <Chip label={simulation.niveau} sx={{ backgroundColor: '#2196f3', color: 'white' }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Explorer;