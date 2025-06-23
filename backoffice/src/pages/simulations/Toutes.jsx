import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaFolder,
  FaFolderOpen,
  FaCalculator,
  FaAtom,
  FaFlask,
  FaLeaf
} from 'react-icons/fa';

import './Toutes.css';

function Toutes() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/simulations/count`);

        const categoryData = [
          {
            name: "Mathématiques",
            description: "Outils mathématiques et simulations numériques",
            link: "/simulations/mathematiques",
            icon: <FaCalculator size={28} />,
            color: "#673ab7",
            key: "Mathematique" // correspond à la base de données
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

        const merged = categoryData.map(category => ({
          ...category,
          count: response.data[category.key] || 0
        }));

        setCategories(merged);
      } catch (err) {
        console.error("Erreur de chargement des catégories :", err);
        setError("Impossible de charger les données des simulations.");
      } finally {
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
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="toutes-simulations">
      <div className="header-section">
        <h1>Laboratoire Virtuel STEM</h1>
        <p className="subtitle">
          Explorez nos simulations scientifiques par domaine d'expertise
        </p>
      </div>

      <div className="folders-container">
        {categories.map((category) => (
          <a
            key={category.key}
            href={category.link}
            className="folder-card"
            style={{ '--folder-color': category.color }}
            aria-label={`Accéder aux simulations de ${category.name}`}
          >
            <div className="folder-header">
              <div className="folder-icon">
                <FaFolder className="closed-folder" size={48} />
                <FaFolderOpen className="opened-folder" size={48} />
              </div>
              <div
                className="category-icon"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>
            </div>

            <div className="folder-content">
              <h3>{category.name}</h3>
              <p className="description">{category.description}</p>
              <div className="simulation-count">
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
