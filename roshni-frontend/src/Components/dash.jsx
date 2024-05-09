import React, { useState, useEffect, Fragment, useRef, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Form, Modal} from "react-bootstrap";
import "./dash.css"
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'



function Dash() {
    const [tests, setTests] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [subject, setSubject] = useState(""); 
    const [imageUrl, setImageUrl] = useState(""); 
    const [time, setTime] = useState(""); 
    const [expiry, setExpiry] = useState(""); 
    const [error, setError] = useState("");
    const [testID, setTestID] = useState("");
    const [testCreated, setTestCreated] = useState(false);
    const [questions,setQuestions] = useState([]);
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showEditSuccessMessage, setShowEditSuccessMessage] = useState(false);
    const [open, setOpen] = useState(false);
    const  cancelButtonRef = useRef(null)
    const [selectedTest, setSelectedTest] = useState(null);
    const [updateData, setUpdateData] = useState({
        subject: "",
        time: "",
        expiry: "",
        imageUrl: ""
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null);
  
    const handleDelete = (testID) => {
        // Set the funder to delete and open the confirmation dialog
        setTestToDelete(tests.find((test) => test.testID === testID));
        setDeleteConfirmationOpen(true);
      };
    useEffect(() => {
        fetchTests();
    }, [modalIsOpen]);

    const fetchTests = async () => {
        try {
            const response = await axios.get("https://roshni-api.onrender.com/api/tests");
            setTests(response.data);
          } catch (error) {
            console.error("Error fetching tests:", error);
            setError("An error occurred while fetching tests.");
        }
    };
    const handleEditSuccess = () => {
        setShowEditSuccessMessage(true);
        setTimeout(() => {
          setShowEditSuccessMessage(false);
        }, 3000); // Hide the success message after 3 seconds (3000 milliseconds)
      };

      const handleSuccess = () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000); // Hide the success message after 3 seconds (3000 milliseconds)
      };

    
      const handleConfirmDelete = async (testID) => {
        try {
            await axios.delete(`https://roshni-api.onrender.com/api/tests/delete/${testID}`);
            // Filter out the deleted test from the state
            setTests(tests.filter(test => test.testID !== testID));
            setOpen(true);        
        } catch (error) {
            console.error('Error deleting test:', error);
            // Optionally, show an error message or handle any other error state
            setError("Error deleting test: " + error.message);
        }
    };

    const handleUpdate = (test) => {
        setSelectedTest(test);
        setEditModalOpen(true);
        setUpdateData({
            subject: test.subject,
            time: test.time,
            expiry: test.expiry,
            imageUrl: test.imageUrl,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://roshni-api.onrender.com/api/tests/update/${selectedTest.testID}`, updateData);
            if (response.data.message === "Test updated successfully") {
                const updatedTests = tests.map((test) => {
                    if (test.testID === selectedTest.testID) {
                        return {
                            ...test,
                            subject: updateData.subject,
                            time: updateData.time,
                            expiry: updateData.expiry,
                            imageUrl: updateData.imageUrl
                        };
                    }
                    return test;
                });
                console.log("Test updated successfully");
                setTests(updatedTests);
                setEditModalOpen(false);
                handleEditSuccess();
            } else {
                console.error("Failed to update test");
            }
        } catch (error) {
            console.error("Error updating test:", error);
            setError("An error occurred while updating the test.");
        }
    };





    
    const fetchQuestions = async (ID) => {
        try {
            console.log("Fetching questions for test ID:", ID);
            const response = await axios.get(`https://roshni-api.onrender.com/api/tests/${ID}/questions`);
    
            // Logging data before navigating
            const testData = response.data;
            const testDetails = tests.find((test) => test.testID === ID);
            console.log("Data to be passed to ", testData);
            console.log("Test details to be passed to ", testDetails);
    
            // Setting state and navigating
            setQuestions(response.data);
            navigate(`/view-questions/${ID}`, {
                state: {
                    data: testData,
                    testdetails: testDetails
                }
            });
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError("An error occurred while fetching questions.");
        }
    };
    const getResults = async (testPin) => {
        try {
            const response = await axios.get("https://roshni-api.onrender.com/api/results");
            const filteredResults = response.data.filter(result => result.testScores[0] === testPin);
            navigate(`/view-results` ,{state: {data: testPin}});
            return filteredResults;
        } catch (error) {
            console.error("Error fetching results:", error);
            throw error;
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject || !time || !expiry) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');

        try {
            const response = await axios.post("https://roshni-api.onrender.com/api/tests/create", {
                subject,
                time,
                expiry,
                imageUrl,
                createDate: new Date().toISOString().slice(0, 10)
            });

            if (response.data.success) {
                setError("Test Created Successfully!");
                setTestID(response.data.testID);
                setTestCreated(true);
                setModalIsOpen(false);
                setShowSuccessMessage(true);
                handleSuccess();
                localStorage.setItem('testID', response.data.testID);
            } else {
                setError(response.data.error || 'Test creation failed.');
            }
        } catch (error) {
            console.error('Error creating test:', error);
            setError("Error creating test: " + error.message);
        }
    };

    return (
        <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tests</h1>
              <div>
                  <a href="#" onClick={() => setModalIsOpen(true)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                      Add Test
                  </a>
              </div>
          </div>
      </header>
      {showSuccessMessage && (
                <div className="bg-green-500 py-2 px-4 rounded-md text-white text-center fixed bottom-4 right-4 flex gap-4">
                  <p>Success! Your test has been added.</p>
                  <span
                    className="cursor-pointer font-bold"
                    onClick={() => setShowSuccessMessage(false)}
                  >
                    <sup>X</sup>
                  </span>
                </div>
              )}      
      {showEditSuccessMessage && (
                <div className="bg-green-500 py-2 px-4 rounded-md text-white text-center fixed bottom-4 right-4 flex gap-4">
                  <p>Success! Your test has been updated.</p>
                  <span
                    className="cursor-pointer font-bold"
                    onClick={() => setShowEditSuccessMessage(false)}
                  >
                    <sup>X</sup>
                  </span>
                </div>
              )} 
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
            Delete Test
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{testToDelete?.subject}</span>?
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={(e) => {
                handleConfirmDelete(testToDelete?.testID);
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
            <div className="py-4 text-center text-base font-semibold leading-6 text-gray-900">Test Deleted Successfully!</div>
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


                <Transition.Root show={editModalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={() => setEditModalOpen(false)}
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

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
                    <form onSubmit={handleEditSubmit}>
                        <div className="text-center">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Update Test</Dialog.Title>
                        </div>

                        {/* Update the input fields according to your test properties */}
                        <div className="mt-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input type="text" name="subject" id="subject" value={updateData.subject} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>

                        <div className="mt-4">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="text" name="time" id="time" value={updateData.time} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>

                        <div className="mt-4">
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry</label>
                        <input type="text" name="expiry" id="expiry" value={updateData.expiry} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>

                        <div className="mt-4">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={updateData.imageUrl} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                        </div>

                        <div className="mt-4">
                        <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update Test</button>
                        </div>
                    </form>
                    </div>
                </Transition.Child>
                </div>
            </Dialog>
            </Transition.Root>



        <div>
            <hr className="hr-custom" />

            <div className="containerrr mt-5">
                <div className="d-flex justify-content-end mb-4">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
                        {tests.map((test, index) => (
                            <div key={test.testID} className="bg-white shadow-md rounded-md p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold leading-6 text-gray-900">{test.subject}</p>
                                        <p className="mt-1 truncate text-base leading-5 text-gray-500">{test.testID}</p>
                                    </div>
                                    <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between">
                                        <p className="text-sm leading-6 text-gray-900">Duration: {test.time} minutes</p>
                                        <p className="text-sm leading-6 text-gray-900">Expiry: {new Date(test.expiry).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-2 flex gap-4">
                                    {/* <a href="#" onClick={(event) => deleteTest(event, test.testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                                        Delete Test
                                    </a> */}
                                    <a href="#" onClick={() => fetchQuestions(test.testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                                        Edit Test
                                    </a>
                                    <TrashIcon className="cursor-pointer h-6 w-6" onClick={() => handleDelete(test.testID)} />
                                    <PencilSquareIcon className="cursor-pointer h-6 w-6" onClick={() => handleUpdate(test)}/>
                                </div>
                        </div>
                    </div>
                    
                   ))}
                </div>         
            </div>                                 
          
            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="modallabels">Add Test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicNumber">
                            <Form.Label className="modallabels">Topic</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name of test"
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicImageURL">
                            <Form.Label className="modallabels">Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image URL for the test"
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicTime">
                            <Form.Label className="modallabels">
                                Time Duration (in minutes)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter time duration (in minutes)"
                                min="1"
                                value={time}
                                onChange={(event) => setTime(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicExpiry">
                            <Form.Label className="modallabels">Expiry Date</Form.Label>
                            <Form.Control
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={expiry}
                                onChange={(event) => setExpiry(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Button variant="custom " className="buttonss" type="submit">
                            Add Test
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        </>
    );


}


export default Dash;
