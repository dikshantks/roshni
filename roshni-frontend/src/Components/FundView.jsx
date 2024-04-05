import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewFunder = () => {
  const [funders, setFunders] = useState([]);
  const [error, setError] = useState("");
  const [selectedFunder, setSelectedFunder] = useState(null);
  const [updateData, setUpdateData] = useState({
    organizationName: "",
    email: "",
    locations: []
  });

  useEffect(() => {
    fetchFunders();
  }, []);

  const fetchFunders = async () => {
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:5000/api/admin/${adminID}/funders`);
      setFunders(response.data.funders);
    } catch (error) {
      console.error("Error fetching funders:", error);
      setError("An error occurred while fetching funders.");
    }
  };

  const handleDelete = async (fundID) => {
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.delete(`http://localhost:5000/api/admin/${adminID}/funders/${fundID}`);
      if (response.status === 200) {
        setFunders((prevFunders) => prevFunders.filter((funder) => funder.fundID !== fundID));
        console.log("Funder deleted successfully");
      } else {
        console.error("Failed to delete funder");
      }
    } catch (error) {
      console.error("Error deleting funder:", error);
      setError("An error occurred while deleting the funder.");
    }
  };

  const handleUpdate = (funder) => {
    setSelectedFunder(funder);
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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminID = localStorage.getItem("accessToken");
      const response = await axios.put(`http://localhost:5000/api/admin/${adminID}/funders/${selectedFunder.fundID}`, updateData);
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
        console.log("Funder updated successfully");
      } else {
        console.error("Failed to update funder");
      }
    } catch (error) {
      console.error("Error updating funder:", error);
      setError("An error occurred while updating the funder.");
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h3>View Funders</h3>

      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Organization Name</th>
            <th>Email</th>
            <th>Locations</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {funders.map((funder) => (
            <tr key={funder.fundID}>
              <td>{funder.organizationName}</td>
              <td>{funder.email}</td>
              <td>{funder.locations.join(", ")}</td>
              <td>
                <button onClick={() => handleDelete(funder.fundID)}>Delete</button>
                <button onClick={() => handleUpdate(funder)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={handleBackToDashboard}>Back to Dashboard</button>

      {selectedFunder && (
        <div>
          <h3>Edit Funder</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Organization Name:</label>
              <input type="text" name="organizationName" value={updateData.organizationName} onChange={handleChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={updateData.email} onChange={handleChange} />
            </div>
            <div>
              <label>Locations:</label>
              <input type="text" name="locations" value={updateData.locations.join(", ")} onChange={handleChange} />
            </div>
            <div>
              <button type="submit">Update Funder</button>
              <button onClick={() => setSelectedFunder(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewFunder;
