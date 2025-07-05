import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteClassModal = ({ show, onHide, className, onDelete }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Suppression de classe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer la classe <strong>{className}</strong> ?
        <br />
        <small className="text-muted">Cette action est irréversible.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteClassModal;