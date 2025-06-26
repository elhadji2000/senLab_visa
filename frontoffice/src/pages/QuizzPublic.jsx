import { useEffect, useState } from 'react';
import { getPublicQuizz } from '../services/quizzService';

const QuizzPublic = () => {
  const [quizz, setQuizz] = useState([]);

  useEffect(() => {
    getPublicQuizz().then(setQuizz).catch(err => {
      console.error("Erreur quiz :", err);
    });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Quiz publics disponibles</h2>
      <div className="row">
        {quizz.map(q => (
          <div key={q._id} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{q.titre}</h5>
                <p className="card-text">Niveau : {q.niveau}</p>
                <a href={`/quizz/${q._id}`} className="btn btn-primary">Faire ce quiz</a>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzPublic;
