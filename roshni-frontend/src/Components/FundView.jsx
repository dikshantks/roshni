import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import './EvalView.css';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

const ViewFunder = () => {
  const [funders, setFunders] = useState([]);
  const [error, setError] = useState("");
  const [selectedFunder, setSelectedFunder] = useState(null);
  const [updateData, setUpdateData] = useState({
    organizationName: "",
    email: "",
    locations: []
  });
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);  
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [funderToDelete, setFunderToDelete] = useState(null);
  

  useEffect(() => {
    fetchFunders();
  }, []);

  const fetchFunders = async () => {
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.get(`https://roshni-api.onrender.com/api/admin/${adminID}/funders`);
      setFunders(response.data.funders);
    } catch (error) {
      console.error("Error fetching funders:", error);
      setError("An error occurred while fetching funders.");
    }
  };

  const handleDelete = (fundID) => {
    // Set the funder to delete and open the confirmation dialog
    setFunderToDelete(funders.find((funder) => funder.fundID === fundID));
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async (fundID) => {
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.delete(`https://roshni-api.onrender.com/api/admin/${adminID}/funders/${fundID}`);
      if (response.status === 200) {
        setFunders((prevFunders) => prevFunders.filter((funder) => funder.fundID !== fundID));
        console.log("Funder deleted successfully");
        setOpen(true);
      } else {
        console.error("Failed to delete funder");
      }
    } catch (error) {
      setError("An error occurred while deleting the funder.");

      console.error("Error deleting funder:", error);
    }
  };

  const handleUpdate = (funder) => {
    setSelectedFunder(funder);
    setEditModalOpen(true);
    setUpdateData({
      organizationName: funder.organizationName,
      email: funder.email,
      locations: funder.locations
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "locations") {
      // Split the comma-separated string into an array
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: value.split(", ")
      }));
    } else {
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide the success message after 3 seconds (3000 milliseconds)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.put(`https://roshni-api.onrender.com/api/admin/${adminID}/funders/${selectedFunder.fundID}`, updateData);
      if (response.status === 200) {
        const updatedFunders = funders.map((funder) => {
          if (funder.fundID === selectedFunder.fundID) {
            return {
              ...funder,
              organizationName: updateData.organizationName,
              email: updateData.email,
              locations: updateData.locations
            };
          }
          return funder;
        });
        setFunders(updatedFunders);
        setSelectedFunder(null);
        setEditModalOpen(false); 
        handleSuccess();    
        console.log("Funder updated successfully");
      } else {
        console.error("Failed to update funder");
      }
    } catch (error) {
      console.error("Error updating funder:", error);
      setError("An error occurred while updating the funder.");
    }
  };

  const columns = [
    {
      name: "Organization Name",
      selector: (row) => row.organizationName,
      sortable: true
    },
    {
      name: "Email",
      selector: (row) => row.email
    },
    {
      name: "Location",
      selector: (row) => {
        return Array.isArray(row.locations) ? row.locations.join(', ') : row.locations;
      },      
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center">
          <TrashIcon className="cursor-pointer h-6 w-6" onClick={() => handleDelete(row.fundID)} />
          <PencilSquareIcon className="cursor-pointer h-6 w-6"  onClick={() => handleUpdate(row)}/>
        </div>
      )    }
  ]



  return (
    <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Funders</h1>
          </div>
        </header>
        {showSuccessMessage && (
                <div className="bg-green-500 py-2 px-4 rounded-md text-white text-center fixed bottom-4 right-4 flex gap-4">
                  <p>Success! Your funder has been updated.</p>
                  <span
                    className="cursor-pointer font-bold"
                    onClick={() => setShowSuccessMessage(false)}
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
            Delete Funder
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{funderToDelete?.organizationName}</span>?
            </p>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                handleConfirmDelete(funderToDelete?.fundID);
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
            <div className="py-4 text-center text-base font-semibold leading-6 text-gray-900">Evaluator Deleted Successfully!</div>
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

                <form onSubmit={handleSubmit}>

                  <div className="text-center">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Edit Funder</Dialog.Title>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input type="text" name="organizationName" id="organizationName" value={updateData.organizationName} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={updateData.email} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>

                  <div className="mt-4">
                    <label htmlFor="locations" className="block text-sm font-medium text-gray-700">Locations</label>
                    <input type="text" name="locations" id="locations" value={updateData.locations.join(", ")} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Update Funder</button>
                  </div>

                </form>

              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>




    <div className="table-container">
      {error && <p className="error-message">{error}</p>}
      <div className="text-end"><input type='text'/></div><table className="table table-bordered table-striped">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.name}
                  className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100"
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {funders.map((record, index) => (
            <tr key={index}>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} className="px-4 py-2">
                  {column.cell ? column.cell(record) : column.selector(record)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
              

      <Link to="/add-funder">
      <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><PlusIcon className="h-6 w-6 text-white" aria-hidden="true" /></button></Link>
    </div>      
  </>
  );
};

export default ViewFunder;
