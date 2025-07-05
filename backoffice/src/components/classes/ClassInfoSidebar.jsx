import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { FaInfoCircle, FaUserTie, FaChartLine } from "react-icons/fa";

const ClassInfoSidebar = ({ classData, studentCount }) => {
  return (
    <>
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <h6 className="text-primary">
            <FaInfoCircle className="me-2" />
            Informations
          </h6>
          <hr />
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Effectif :</strong> {studentCount}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Niveau :</strong> {classData.niveau}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Année scolaire :</strong> {classData.annee_scolaire}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Établissement :</strong> {classData.etablissement || "Non spécifié"}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h6 className="text-success">
            <FaUserTie className="me-2" />
            Enseignant
          </h6>
          <hr />
          <p className="small">
            Vous pouvez gérer les élèves, créer des évaluations et générer des codes d'accès.
          </p>
          
          <h6 className="text-info mt-3">
            <FaChartLine className="me-2" />
            Statistiques
          </h6>
          <hr />
          <p className="small">
            Moyenne générale : <strong>14.5/20</strong>
            <br />
            Taux de réussite : <strong>85%</strong>
          </p>
        </Card.Body>
      </Card>
    </>
  );
};

export default ClassInfoSidebar;