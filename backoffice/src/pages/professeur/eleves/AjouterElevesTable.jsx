import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Importez useParams
import { Table, Button, Form, Container, Alert } from "react-bootstrap";
import { addMultipleEleves } from "../../../api/student.api";

const AjouterElevesTable = ({ classId, onSuccess, onCancel }) => {
  const [eleves, setEleves] = useState([
    { nom: "", prenom: "", email: "", date_naissance: "", telephone: "" },
  ]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Ajoutez l'ID de classe à chaque élève
      const payload = eleves
        .filter(el => el.nom && el.prenom && el.email)
        .map(el => ({
          ...el,
          classe: classId // Ici on ajoute l'ID de la classe
        }));

      if (payload.length === 0) {
        setError("Veuillez saisir au moins un élève valide");
        return;
      }

      const response = await addMultipleEleves(payload);
      setSuccess(`${payload.length} élèves ajoutés avec succès`);
      setError("");
      
      setTimeout(() => {
        setEleves([{ nom: "", prenom: "", email: "", date_naissance: "", telephone: "" }]);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout des élèves");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...eleves];
    updated[index][field] = value;
    setEleves(updated);
  };

  const ajouterLigne = () => {
    setEleves([
      ...eleves,
      { nom: "", prenom: "", email: "", date_naissance: "", telephone: "" },
    ]);
  };

  const supprimerLigne = (index) => {
    const updated = eleves.filter((_, i) => i !== index);
    setEleves(updated);
  };


  return (
    <Container className="my-2 p-0">
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Table bordered hover responsive className="mb-3">
          <thead className="table-light">
            <tr>
              <th>Nom *</th>
              <th>Prénom *</th>
              <th>Email *</th>
              <th>Date de naissance</th>
              <th>Téléphone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((eleve, idx) => (
              <tr key={idx}>
                <td>
                  <Form.Control
                    type="text"
                    value={eleve.nom}
                    required
                    onChange={(e) => handleChange(idx, "nom", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={eleve.prenom}
                    required
                    onChange={(e) => handleChange(idx, "prenom", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="email"
                    value={eleve.email}
                    required
                    onChange={(e) => handleChange(idx, "email", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="date"
                    value={eleve.date_naissance}
                    onChange={(e) => handleChange(idx, "date_naissance", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="tel"
                    value={eleve.telephone}
                    onChange={(e) => handleChange(idx, "telephone", e.target.value)}
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => supprimerLigne(idx)}
                    disabled={eleves.length === 1}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between">
          <Button 
            variant="secondary" 
            onClick={ajouterLigne}
            disabled={submitting}
          >
            ➕ Ajouter une ligne
          </Button>
          <div>
            <Button 
              variant="outline-secondary" 
              onClick={onCancel}
              className="me-2"
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button 
              variant="success" 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enregistrement...
                </>
              ) : (
                "✅ Enregistrer"
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default AjouterElevesTable;