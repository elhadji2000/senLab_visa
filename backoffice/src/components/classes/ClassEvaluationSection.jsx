/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Table,
  Badge,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";
import { fetchResultatsParClasse } from "../../api/evaluations";
import moment from "moment";
import { FaChartBar } from "react-icons/fa";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(...registerables);

const ClassQuizResultsSection = ({ classId }) => {
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResultats = async () => {
    try {
      setLoading(true);
      const res = await fetchResultatsParClasse(classId);
      setResultats(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des résultats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResultats();
  }, [classId]);

  // 🔹 Parse une note "7/10" en nombre sur 20
  const parseNote = (note) => {
    if (typeof note !== "string") return null;
    const [obt, tot] = note.split("/").map(Number);
    return tot && !isNaN(obt) && !isNaN(tot) ? (obt / tot) * 20 : null;
  };

  const getChartData = () => {
    if (resultats.length === 0) return null;

    const quizLabels = [...new Set(resultats.map((r) => r.quiz.titre))];
    const quizAverages = quizLabels.map((label) => {
      const quizResults = resultats.filter((r) => r.quiz.titre === label);
      const notes = quizResults
        .map((r) => parseNote(r.note))
        .filter((n) => n !== null);
      const avg =
        notes.length > 0
          ? notes.reduce((sum, n) => sum + n, 0) / notes.length
          : 0;
      return avg.toFixed(2);
    });

    return {
      labels: quizLabels,
      datasets: [
        {
          label: "Moyenne par quiz (/20)",
          data: quizAverages,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = getChartData();

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-light">
        <strong>Résultats de quiz de la classe</strong>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : resultats.length === 0 ? (
          <div className="text-center p-4 text-muted">
            Aucun résultat disponible
          </div>
        ) : (
          <>
            <Row className="mb-4">
              <Col md={8}>
                <h5>
                  <FaChartBar className="me-2" />
                  Moyennes par quiz
                </h5>
                <div style={{ height: "300px" }}>
                  {chartData && (
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 20,
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </Col>

              <Col md={4}>
                <h5>Moyennes par élève</h5>
                <ListGroup>
                  {Array.from(
                    new Map(
                      resultats
                        .filter((r) => r.eleve)
                        .map((r) => {
                          const eleveId = r.eleve._id;
                          const notes = resultats
                            .filter((rr) => rr.eleve?._id === eleveId)
                            .map((rr) => parseNote(rr.note))
                            .filter((n) => n !== null);
                          const moy =
                            notes.length > 0
                              ? notes.reduce((sum, n) => sum + n, 0) /
                                notes.length
                              : 0;

                          return [
                            eleveId,
                            {
                              _id: eleveId,
                              nom: r.eleve.nom,
                              prenom: r.eleve.prenom,
                              moy,
                            },
                          ];
                        })
                    ).values()
                  ).map((eleve) => (
                    <ListGroup.Item key={eleve._id}>
                      <strong>
                        {eleve.prenom} {eleve.nom}
                      </strong>
                      <Badge
                        bg={eleve.moy >= 10 ? "success" : "danger"}
                        className="float-end"
                      >
                        {eleve.moy.toFixed(2)} /20
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>

            <h5 className="mt-4">Détail des résultats</h5>
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>Élève</th>
                  <th>Quiz</th>
                  <th>Matière</th>
                  <th>Score</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {resultats.map((r) => (
                  <tr key={r._id}>
                    <td>
                      {r.eleve ? `${r.eleve.prenom} ${r.eleve.nom}` : "Inconnu"}
                    </td>
                    <td>{r.quiz?.titre || "Non défini"}</td>
                    <td>{r.quiz?.categorie || "Non défini"}</td>
                    <td>{r.score}%</td>
                    <td>
                      <Badge
                        bg={(() => {
                          const val = parseNote(r.note);
                          return val >= 10 ? "success" : "danger";
                        })()}
                      >
                        {r.note}
                      </Badge>
                    </td>
                    <td>{moment(r.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ClassQuizResultsSection;
