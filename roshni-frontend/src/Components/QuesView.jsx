import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Form, Modal, Nav} from "react-bootstrap";
import CreateQuestions from './CreateQuestions'; // Import CreateQuestions component
import { useLocation } from "react-router-dom"; // Add this line
import UpdateQuestions from "./UpdateQuestions";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

const TestQuestions = () => {
  const { testID } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);  
  const location = useLocation();
  const initialTestData = location.state.data.questions;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [testData, setTestData] = useState(initialTestData);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "",
    difficulty: "",
    options: [],
    correct: '',
    image:null,
    marks: 0
  });
  const [updateData, setUpdateData] = useState({
      text: "",
      type: "",
      difficulty: "",
      options: [],
      correct: '',
      image:null,
      marks: 0
  });
  const [ID, setID] = useState(null);
   const [selectedQuestion, setSelectedQuestion] = useState(null);
   const [showUpdateModals, setShowUpdateModals] = useState({});
   const [open, setOpen] = useState(false);
   const  cancelButtonRef = useRef(null)
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
   const [quesToDelete, setQuesToDelete] = useState(null);
 

   const handleDelete = (questionID) => {
    // Set the funder to delete and open the confirmation dialog
    setQuesToDelete(testData.find((question) => question.questionID === questionID));
    setDeleteConfirmationOpen(true);
  };






   const handleSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide the success message after 3 seconds (3000 milliseconds)
  };

   useEffect(() => {
     // Initialize the showUpdateModals state with false for each question
     const initialShowUpdateModals = testData.reduce((acc, question) => {
       acc[question.questionID] = false;
       return acc;
     }, {});
     setShowUpdateModals(initialShowUpdateModals);
   }, [testData]);
 
   // Function to toggle the visibility of the update modal for a specific question
   const toggleUpdateModal = (questionID) => {
     setShowUpdateModals((prevShowUpdateModals) => ({
       ...prevShowUpdateModals,
       [questionID]: !prevShowUpdateModals[questionID],
     }));
   };

  const handleConfirmDelete = async ( questionID) => {
    try {
      console.log("Deleting question with ID:", questionID);
      const response = await axios.delete(`http://localhost:5000/api/tests/${testID}/questions/${questionID}`);
      console.log(response.data, response.data.message)
      if (response.data.message === "Question deleted successfully") {
        setTestData(testData.filter(question => question.questionID !== questionID)); 
        console.log("Question deleted successfully");
        setOpen(true);
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("An error occurred while deleting the question.");
    }
  };

  
  // const handleUpdate = async (question) => {
  //   console.log(question);
  //   setSelectedQuestion(question);
  //   setUpdateData({
  //     text: question.text,
  //     type: question.type,
  //     difficulty: question.difficulty,
  //     options: question.options.join(", "),
  //     correct: question.correct.join(","),
  //     image: question.image,
  //     marks: question.marks
  //   });
  
  //   try {
  //     const response = await axios.put(`http://localhost:5000/api/tests/${testID}/questions/${question.questionID}`, updateData);
  //     if (response.data.message === "Question updated successfully") {
  //       const updatedQuestions = questions.map((q) => {
  //         if (q.questionID === question.questionID) {
  //           return { ...q, ...updateData };
  //         }
  //         return q;
  //       });
  //       setQuestions(updatedQuestions);
  //       setSelectedQuestion(null);
  //       console.log("Question updated successfully");
  //     } else {
  //       console.error("Failed to update question");
  //     }
  //   } catch (error) {
  //     console.error("Error updating question:", error);
  //     setError("An error occurred while updating the question.");
  //   }
  // };

  const getQuestions = async () => {
    try {
        console.log("Fetching questions for test ID in QuesView:", testID);
        const response = await axios.get(`http://localhost:5000/api/tests/${testID}/questions`);

        // Logging data 
        const quesData = response.data;
        console.log("Data to be passed to quesData", quesData);
        setQuestions(response.data);
        setTestData(response.data.questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        setError("An error occurred while fetching questions.");
    }
};
  const addQuestion = (newQuestion, message) => {
    // Update the testData state with the new question
    setTestData([...testData, newQuestion]);
    // Close the modal after successful addition
    if (message === "Question added successfully") {
      handleAddCloseModal();
    }
};
  const updateQuestion = (updatedQuestion, message) => {
    // Update the testData state with the updated question
    const updatedQuestions = testData.map((question) => {
      if (question.questionID === updatedQuestion.questionID) {
        return updatedQuestion;
      }
      return question;
    });
    setTestData(updatedQuestions);
    // Close the modal after successful update
    if (message === "Question updated successfully") {
      handleUpdateCloseModal();
    }
  };

  useEffect(() => {
    getQuestions();
  }, [testID]);
  

  const handleAddCloseModal = () => setShowAddModal(false);
  const handleAddModal = (event, testID) => {
    event.preventDefault();
    setID(testID); // Set the testID
    setShowAddModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
     // Function to open the update modal for a specific question and set the selected question
     const handleUpdateModal = (question) => {
      setSelectedQuestion(question);
      toggleUpdateModal(question.questionID);
    };
  
  return (
    <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Questions</h1>
              <div>
                  <a href="#" onClick={(event) => handleAddModal(event, testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                      Add Question
                  </a>
              </div>
          </div>
      </header>
      <Transition.Root show={deleteConfirmationOpen} as={Fragment}>
  <Dialog
    as="div"
    className="fixed inset-0 z-10 overflow-y-auto"
    onClose={() => setDeleteConfirmationOpen(false)}
  >
    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
      </Transition.Child>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            Delete Question
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{quesToDelete?.questionID}</span>?
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={(e) => {
                handleConfirmDelete(quesToDelete?.questionID);
                setDeleteConfirmationOpen(false);
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => setDeleteConfirmationOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Dialog>
</Transition.Root>




    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
            <Dialog.Panel className="py-3 relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>              
            <div className="py-4 text-center text-base font-semibold leading-6 text-gray-900">Question Deleted Successfully!</div>
            <div class="flex items-center justify-center">
              <button
                type="button"
                class="mt-3 inline-flex w-full place-items-center justify-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={() => setOpen(false)}
                ref={cancelButtonRef}
              >
                Dismiss
              </button>
            </div>
            </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

      <Modal show={showAddModal} onHide={handleAddCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateQuestions closeModal={addQuestion} onSuccess={handleSuccess} testID={testID}/> 
        </Modal.Body>
      </Modal>
      {showSuccessMessage && (
                <div className="bg-green-500 py-2 px-4 rounded-md text-white text-center fixed bottom-4 right-4 flex gap-4">
                  <p>Success! Your question has been added.</p>
                  <span
                    className="cursor-pointer font-bold"
                    onClick={() => setShowSuccessMessage(false)}
                  >
                    <sup>X</sup>
                  </span>
                </div>
              )}
      <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-10">
      {testData.map((question, index) => (
                <div className="dark:bg-grey-500 m-5 dark:text-black rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl" key={index}>
                {question.imageUrl && (
                        <img
                          src={`data:image/png;base64;,${question.imageUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")}`}
                          alt="Question Image"
                          className="mb-4"
                        />
                      )}                  
                    <div className="font-semibold text-lg mb-4">Question {index + 1}: <span className="text-black">{question.text}</span></div>
                  <div><span className="font-semibold">Type:</span> <span className="text-black">{question.type}</span></div>
                  <div><span className="font-semibold">Difficulty:</span> <span className="text-black">{question.difficulty}</span></div>
                  <div><span className="font-semibold">Options: </span>
                    {question.options.map((option, idx) => (
                      <span key={idx} className="text-black">{option}{idx !== question.options.length - 1 && ", "}</span>
                    ))}
                  </div>                   
              <div><span className="font-semibold">Correct Answer:</span> <span className="text-black">{question.correct}</span></div>
                  <div><span className="font-semibold">Marks:</span> <span className="text-black">{question.marks}</span></div>
                {/* Update modal */}
                    <Modal show={showUpdateModals[question.questionID]} onHide={() => toggleUpdateModal(question.questionID)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Update Question {question.questionID}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <UpdateQuestions selectedQuestion={selectedQuestion} quesID={question.questionID} testID={testID} closeModal={updateQuestion} />
                    </Modal.Body>
                    </Modal>
                <div className="mt-4 flex gap-4">
              <TrashIcon className="cursor-pointer h-6 w-6" onClick={() => handleDelete(question.questionID)} />
              <PencilSquareIcon className="cursor-pointer h-6 w-6" onClick={() => handleUpdateModal(question)}/>

            </div>
        </div>
        ))}
      </div>
    </>
  );
};

export default TestQuestions;
