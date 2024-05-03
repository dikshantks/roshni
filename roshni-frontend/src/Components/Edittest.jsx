import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateQuestions from './CreateQuestions'; // Import CreateQuestions component

const AddQuestionModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Add Question
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateQuestions closeModal={handleCloseModal} /> {/* Pass handleCloseModal function as prop */}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddQuestionModal;
