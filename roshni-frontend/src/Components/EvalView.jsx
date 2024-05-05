import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './EvalView.css';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'



const ViewEval = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null)
  useEffect(() => {
    fetchEvaluators();
  }, []);

  const fetchEvaluators = async () => {
    try {
      const response = await axios.get(`https://roshni-api.onrender.com/api/evaluators`);
      setEvaluators(response.data);
    } catch (error) {
      console.error("Error fetching evaluators:", error);
      setError("An error occurred while fetching evaluators.");
    }
  };

  const handleDelete = async (evalID) => {
    try {
      const response = await axios.delete(`https://roshni-api.onrender.com/api/evaluators/delete/${evalID}`);
      if (response.status === 200) {
        setEvaluators((prevEvaluators) => prevEvaluators.filter((evaluator) => evaluator.evalID !== evalID));
        console.log("Evaluator deleted successfully");
        setOpen(true);
      } else {
        console.error("Failed to delete evaluator");
      }
    } catch (error) {
      console.error("Error deleting evaluator:", error);
      setError("An error occurred while deleting the evaluator.");
    }
  };

  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true
    },
    {
      name: "Email",
      selector: (row) => row.email
    },
    {
      name: "Date of Birth",
      selector: (row) => row.DOB
    },
    {
      name: "Location",
      selector: (row) => row.loc,
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center">
          <TrashIcon className="cursor-pointer h-6 w-6" onClick={() => handleDelete(row.evalID)} />
        </div>
      )    }
  ]

  const [records, setRecords] = useState(evaluators);
  function handleFilter(e) {
    const value = e.target.value.trim(); // Trim whitespace from input value
    if (value === "") {
      setRecords(evaluators); // Set records back to original evaluators array
    } else {
      const filtered = evaluators.filter((evaluator) => {
        return evaluator.firstname.toLowerCase().includes(value.toLowerCase());
      });
      setRecords(filtered);
    }
  }
  
  useEffect(() => {
    setRecords(evaluators); // Update records whenever evaluators changes
  }, [evaluators]);

  return (
    <>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Facilitators</h1>
          </div>
        </header>
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

    <div className="table-container">
      {error && <p className="error-message">{error}</p>}
      <div className="text-end"><input type='text' onChange={handleFilter}/></div><table className="table table-bordered table-striped">
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
  {evaluators.map((record, index) => (
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
      

      <Link to="/add-evaluator">
      <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><PlusIcon className="h-6 w-6 text-white" aria-hidden="true" /></button></Link>
    </div>
    </>
  );
};


export default ViewEval;
