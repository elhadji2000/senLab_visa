import { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import { getPublicQuizz } from "services/quizzService";
import routes from "routes";
import footerRoutes from "footer.routes";

function QuizzUs() {
  const [quizz, setQuizz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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

  const filteredQuizz = quizz.filter((q) =>
    q.titre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <MKBox position="fixed" top="0.5rem" width="100%">
        <DefaultNavbar
          routes={routes}
          action={{
            type: "internal",
            route: "/pages/landing-pages/about-us",
            label: "documentation",
            color: "info",
          }}
        />
      </MKBox>

      <MKBox pt={6} px={3} mt={6}>
        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Rechercher un quiz par titre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "20px",
            }}
          />
        </div>

        {!loading ? (
          <div style={{ display: "flex", gap: "20px" }}>
            {/* Bloc gauche : Liste des quiz */}
            <div style={{ flex: 2 }}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  background: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                {filteredQuizz.length === 0 ? (
                  <p>Aucun quiz trouvé.</p>
                ) : (
                  filteredQuizz.map((q, index) => (
                    <p key={q._id} style={{ fontSize: "0.8rem", marginBottom: "10px" }}>
                      <span
                        style={{
                          textDecoration: "underline",
                          color: "#1976d2",
                          fontWeight: 400,
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => (window.location.href = `/quizz/${q._id}`)}
                      >
                        {index + 1}) {q.titre}.
                      </span>
                      <span style={{ color: "#555" }}>{q.description || "Aucune description"}</span>
                    </p>
                  ))
                )}
              </div>
            </div>

            {/* Bloc droit : Astuces / Objectif */}
            <div style={{ flex: 1, position: "sticky", top: "80px" }}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  background: "#f9f9f9",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h5 style={{ color: "#198754" }}>💡 Astuces</h5>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  - Révise avant de commencer un quiz. <br />
                  - Essaie de finir tous les niveaux pour débloquer des récompenses. <br />-
                  Concentre-toi sur chaque catégorie pour améliorer ton score.
                </p>
                <hr />
                <h6 style={{ color: "#0dcaf0" }}>🎯 Objectif</h6>
                <p style={{ fontSize: "0.85rem", color: "#555" }}>
                  Obtenir le meilleur score et comparer tes résultats avec les autres.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Chargement des quiz...</p>
        )}
      </MKBox>

      {/* Footer */}
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default QuizzUs;
