import { useEffect, useState } from "react";
import { getPublicQuizz } from "../services/quizzService";
import { Spinner } from "react-bootstrap";
import { FaRocket, FaBrain } from "react-icons/fa";
import { motion } from "framer-motion";
import "./css/QuizzPublic.css";

const QuizzPublic = () => {
  const [quizz, setQuizz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("Tous");

  useEffect(() => {
    getPublicQuizz()
      .then((res) => {
        setQuizz(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur quiz :", err);
        setLoading(false);
      });
  }, []);
  const filteredQuizz = quizz.filter(
    (q) =>
      q.titre.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedNiveau === "Tous" || q.niveau === selectedNiveau)
  );

  const groupByCategorieAndNiveau = (quizzList) => {
    const grouped = {};
    quizzList.forEach((q) => {
      const cat = q.categorie || "Autres";
      const niv = q.niveau || "Non défini";

      if (!grouped[cat]) grouped[cat] = {};
      if (!grouped[cat][niv]) grouped[cat][niv] = [];

      grouped[cat][niv].push(q);
    });
    return grouped;
  };

  const groupedQuizz = groupByCategorieAndNiveau(filteredQuizz);

  return (
    <motion.div
      className="quizz-page bg-light py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="row">
          {/* Colonne principale */}
          <div className="col-lg-9">
            <div className="mb-4 text-center">
              <h1 className="fw-bold text-primary">
                <FaBrain className="me-2" /> Défis Scientifiques
              </h1>
              <p className="text-muted">Choisis une catégorie et commence !</p>
            </div>
            {/* 🔍 Filtres de recherche et de niveau */}
            <div className="row mb-4">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Rechercher un quiz par titre..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                >
                  <option value="Tous">🎓 Tous les niveaux</option>
                  <option value="6e">6e</option>
                  <option value="5e">5e</option>
                  <option value="4e">4e</option>
                  <option value="3e">3e</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                  <option value="Terminale">Terminale</option>
                </select>
              </div>
            </div>
            {!loading ? (
              Object.entries(groupedQuizz).map(([categorie, niveaux]) => (
                <div key={categorie} className="mb-4">
                  <h4 className="text-dark border-bottom pb-2 mb-3">
                    {categorie}
                  </h4>

                  {Object.entries(niveaux).map(([niveau, quizzes]) => (
                    <div key={niveau} className="ms-3 mb-3">
                      <h6 className="text-secondary mb-2">🎓 {niveau}</h6>
                      <ul className="list-group">
                        {quizzes.map((q) => (
                          <li
                            key={q._id}
                            className="list-group-item d-flex justify-content-between align-items-start"
                          >
                            <div className="ms-2 me-auto">
                              <div className="fw-bold">
                                <a
                                  href={`/quizz/${q._id}`}
                                  className="text-decoration text-primary"
                                >
                                  {q.titre}
                                </a> --- <small className="text-muted fw-italic fs-0.08">
                                {q.description || "Aucune description"}
                              </small>
                              </div>
                              
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>

          {/* Colonne d'informations à droite */}
          <div className="col-lg-3 mt-4 mt-lg-0">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">💡 Astuce</h5>
                <p className="card-text small text-muted">
                  Révise avant de commencer un quiz pour maximiser ton score !
                </p>

                <hr />
                <h6 className="text-secondary">🎯 Objectif</h6>
                <p className="small text-muted">
                  Tente d'obtenir le meilleur score pour figurer parmi les
                  meilleurs.
                </p>

                <hr />
                <h6 className="text-success">🔥 Quiz Populaires</h6>
                {quizz.slice(0, 3).map((q) => (
                  <p key={q._id} className="small mb-1">
                    <a
                      href={`/quizz/${q._id}`}
                      className="text-decoration-none text-dark"
                    >
                      ➤ {q.titre}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizzPublic;
