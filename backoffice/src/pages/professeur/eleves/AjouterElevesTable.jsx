import React, { useState, useEffect } from "react";
import { Table, Button, Form, Container, Alert } from "react-bootstrap";
import { addMultipleEleves, updateEleve } from "../../../api/student.api";
import moment from "moment";

const AjouterElevesTable = ({ classId, eleveToEdit, onSuccess, onCancel }) => {
  const [eleves, setEleves] = useState([
    { nom: "", prenom: "", email: "", date_naissance: "", telephone: "" }
  ]);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🟦 Si on veut modifier un élève → préremplir le formulaire
  useEffect(() => {
    if (eleveToEdit) {
      setEleves([{
        nom: eleveToEdit.nom,
        prenom: eleveToEdit.prenom,
        email: eleveToEdit.email,
        date_naissance: moment(eleveToEdit.date_naissance).format("YYYY-MM-DD"),
        telephone: eleveToEdit.telephone
      }]);
    }
  }, [eleveToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const el = eleves[0];

      if (!el.nom || !el.prenom || !el.email) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      //  MODE MODIFICATION
      if (eleveToEdit) {
        await updateEleve(eleveToEdit._id, {
          ...el,
          classe: classId
        });

        setSuccess("Élève modifié avec succès !");
        setTimeout(onSuccess, 1800);
        return;
      }

      //  MODE AJOUT MULTIPLE
      const payload = eleves.map(e => ({ ...e, classe: classId }));
      await addMultipleEleves(payload);

      setSuccess(`${payload.length} élèves ajoutés avec succès`);
      setTimeout(onSuccess, 1800);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...eleves];
    updated[index][field] = value;
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
              {!eleveToEdit && <th>Action</th>}
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

                {!eleveToEdit && (
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setEleves(eleves.filter((_, i) => i !== idx))}
                      disabled={eleves.length === 1}
                    >
                      Supprimer
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Boutons */}
        <div className="d-flex justify-content-between">
          {!eleveToEdit && (
            <Button variant="secondary" onClick={() =>
              setEleves([...eleves, { nom: "", prenom: "", email: "", date_naissance: "", telephone: "" }])
            }>
              Ajouter une ligne
            </Button>
          )}

          <div>
            <Button variant="outline-secondary" onClick={onCancel} className="me-2">
              Annuler
            </Button>

            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? "Traitement..." : eleveToEdit ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default AjouterElevesTable;
