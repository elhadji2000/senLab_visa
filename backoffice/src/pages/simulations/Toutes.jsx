import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFolderOpen, FaCalculator, FaAtom, FaFlask, FaLeaf } from 'react-icons/fa';
import './Toutes.css';

function Toutes() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Récupérer le nombre de simulations par catégorie depuis le backend
        const response = await axios.get(`${API_BASE_URL}/api/simulations/count-by-category`);
        
        // Mapper les données reçues avec les informations de vos catégories
        const categoryData = [
          { 
            name: "Mathématiques", 
            description: "Outils mathématiques et simulations numériques",
            link: "/simulations/mathematiques",
            icon: <FaCalculator size={28} />,
            color: "#673ab7",
            key: "Mathematique" // Clé correspondant à celle utilisée dans votre base de données
          },
          { 
            name: "Physique", 
            description: "Lois physiques et phénomènes naturels",
            link: "/simulations/physique",
            icon: <FaAtom size={28} />,
            color: "#3f51b5",
            key: "Physique"
          },
          { 
            name: "Chimie", 
            description: "Réactions chimiques et modèles moléculaires",
            link: "/simulations/chimie",
            icon: <FaFlask size={28} />,
            color: "#009688",
            key: "Chimie"
          },
          { 
            name: "Biologie", 
            description: "Systèmes vivants et sciences de la Terre",
            link: "/simulations/biologie",
            icon: <FaLeaf size={28} />,
            color: "#4caf50",
            key: "Biologie"
          }
        ];

        // Fusionner les données statiques avec les counts dynamiques
        const mergedCategories = categoryData.map(category => ({
          ...category,
          count: response.data[category.key] || 0
        }));

        setCategories(mergedCategories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur lors du chargement des catégories: {error}</p>
      </div>
    );
  }

  return (
    <div className="toutes-simulations">
      <div className="header-section">
        <h1>Laboratoire Virtuel STEM</h1>
        <p className="subtitle">Explorez nos simulations scientifiques par domaine d'expertise</p>
      </div>
      
      <div className="folders-container">
        {categories.map((category, index) => (
          <a 
            key={index} 
            href={category.link} 
            className="folder-card"
            style={{ '--folder-color': category.color }}
          >
            <div className="folder-header">
              <div className="folder-icon">
                <FaFolder className="closed-folder" size={48} />
                <FaFolderOpen className="opened-folder" size={48} />
              </div>
              <div className="category-icon" style={{ backgroundColor: `${category.color}20` }}>
                {category.icon}
              </div>
            </div>
            <div className="folder-content">
              <h3>{category.name}</h3>
              <p className="description">{category.description}</p>
              <div className="simulation-count">
                <span>{category.count}</span> simulation{category.count !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="hover-arrow">→</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Toutes;