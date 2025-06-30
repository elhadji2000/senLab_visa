import { useEffect, useState } from 'react';
import { getPublicQuizz } from '../services/quizzService';
import { Spinner } from 'react-bootstrap';
import { FaRocket, FaBrain, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './css/QuizzPublic.css';

const QuizzPublic = () => {
  const [quizz, setQuizz] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicQuizz()
      .then(res => {
        setQuizz(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur quiz :", err);
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    offscreen: { y: 60, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', bounce: 0.4, duration: 0.8 }
    }
  };

  return (
    <motion.div
      className="quizz-page bg-light py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <motion.div
          className="text-center mb-5"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="display-5 fw-bold text-primary">
            <FaBrain className="me-2" /> Défis Scientifiques 🧪
          </h1>
          <p className="lead text-muted">
            Teste ton savoir dans différents domaines en un clic !
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="row g-4">
            {quizz.map((q, index) => (
              <motion.div
                key={q._id}
                className="col-12 col-sm-6 col-lg-4"
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
              >
                <div className="card shadow-sm border-0 quizz-card h-100">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">{q.titre}</h5>
                      {index < 3 && (
                        <span className="badge bg-warning text-dark">
                          <FaTrophy className="me-1" /> Populaire
                        </span>
                      )}
                    </div>

                    <p className="small text-muted mb-2">
                      <span className="badge bg-gradient bg-info text-dark me-2">
                        Niveau : {q.niveau}
                      </span>
                      <span className="badge bg-light text-primary border">
                        {q.categorie || 'Général'}
                      </span>
                    </p>

                    <p className="text-muted small flex-grow-1 mb-4">
                      {q.description || "Teste tes connaissances sur ce sujet passionnant !"}
                    </p>

                    <motion.a
                      href={`/quizz/${q._id}`}
                      className="btn btn-outline-primary w-100 fw-bold d-flex align-items-center justify-content-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaRocket className="me-2" />
                      Lancer le quiz
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizzPublic;
