// Task 2.2 Component that creates a user interface using a form and HTML elements for updating data for a given product Name (Used Endpoint created in Task 1.6)

import React, { useState } from "react";
import "./FormStyle.css";
// Importing the axios instance to make API calls
import api from "../api"; 

function UpdateProduct() {
  // Setting up state to hold the NAME of the product we want to find as per Task 2.2 requirements
  const [targetProductName, setTargetProductName] = useState("");

  // These states will hold the new values entered by the user
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newUnitsSold, setNewUnitsSold] = useState("");
  const [newReturns, setNewReturns] = useState("");
  const [newRevenue, setNewRevenue] = useState("");
  const [newRating, setNewRating] = useState("");
  const [newStock, setNewStock] = useState(""); 
  const [newSeason, setNewSeason] = useState("");
  const [newTrend, setNewTrend] = useState("");

  // This state is for showing success or error messages to the user
  const [message, setMessage] = useState(""); 

  // I made an array of field names that need to be numbers so I can convert them later
  const numericFields = ['unitsSold', 'returns', 'revenue', 'customerRating', 'stockLevel', 'trendScore'];
  
  // I am combining all the state values into one object so I can loop through them easily
  const allUpdateFields = {
    productCategory: newProductCategory,
    unitsSold: newUnitsSold,
    returns: newReturns,
    revenue: newRevenue,
    customerRating: newRating,
    stockLevel: newStock,
    season: newSeason,
    trendScore: newTrend,
  };

  async function handleUpdate(e) {
    // Prevent the page from reloading when the form is submitted
    e.preventDefault();
    setMessage("");

    // INPUT VALIDATION

    // Simple validation to make sure the user typed a product name to identify the record.
    if (!targetProductName.trim()) {
      setMessage("Error: Product Name is required to identify the record.");
      return;
    }

    // Checks if the search name or new category contains any numbers.
    if (/\d/.test(targetProductName) || /\d/.test(newProductCategory)) {
      setMessage("Error: Product Names and Categories can only contain letters, not numbers.");
      return;
    }

    // --- NUMERIC CHECKS ---
    if (newUnitsSold !== "" && Number(newUnitsSold) < 0) {
      setMessage("Error: New Units Sold cannot be negative.");
      return;
    }

    if (newReturns !== "" && Number(newReturns) < 0) {
      setMessage("Error: New Returns cannot be negative.");
      return;
    }

    if (newRevenue !== "" && Number(newRevenue) < 0) {
      setMessage("Error: New Revenue cannot be negative.");
      return;
    }

    if (newRating !== "") {
        const ratingNum = Number(newRating);
        if (ratingNum < 0 || ratingNum > 5) {
            setMessage("Error: New Customer Rating must be between 0.0 and 5.0.");
            return;
        }
    }

    if (newStock !== "" && Number(newStock) < 0) { 
      setMessage("Error: Stock Level cannot be negative.");
      return;
    }

    if (newSeason !== "") {
        const validSeasons = ["Spring", "Summer", "Autumn", "Winter"];
        const formattedSeason = newSeason.trim().charAt(0).toUpperCase() + newSeason.trim().slice(1).toLowerCase();
        
        if (!validSeasons.includes(formattedSeason)) {
            setMessage("Error: Season must be exactly 'Spring', 'Summer', 'Autumn', or 'Winter'.");
            return; 
        }
    }

    if (newTrend !== "") {
        const trendNum = Number(newTrend);
        if (trendNum < 0 || trendNum > 100) {
            setMessage("Error: Trend Score must be between 0 and 100.");
            return;
        }
    }

    // Creating the object we will send to the server
    // We use the product name as the primary key for the update query
    const updatePayload = { 
        productName: targetProductName 
    }; 
    
    // Here I loop through the fields object to see which inputs were actually filled in
    for (const [key, value] of Object.entries(allUpdateFields)) {
        if (value !== "") {
            if (numericFields.includes(key)) {
                updatePayload[key] = Number(value);
            } else {
                if (key === 'season') {
                     updatePayload[key] = value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();
                } else {
                     updatePayload[key] = value;
                }
            }
        }
    }

    try {
      // Sending the clean data to the backend API using a POST request
      const response = await api.post("/api/updateProduct", updatePayload); 
      
      console.log("SERVER RESPONSE:", response.data);
      setMessage(`Product '${targetProductName}' updated successfully!`);
    } catch (err) {
      console.error("ERROR:", err.response ? err.response.data : err);
      setMessage(`Error updating product: ${err.response?.data?.message || err.message}`);
    }
  }

  return (
    <div className="form-container">
      <h2>Update Product</h2>
      
      <form onSubmit={handleUpdate}>

        <label>Product Name to Update (*REQUIRED*)</label>
        <input 
            value={targetProductName} 
            onChange={(e)=>setTargetProductName(e.target.value)}
            placeholder="Enter the Product Name exactly as it appears"
        />
        
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
            Enter NEW values for the fields you want to change:
        </p>

        <label>Product Category</label>
        <select value={newProductCategory} onChange={(e)=>setNewProductCategory(e.target.value)} required>
          <option value="">-- Select Category --</option>
          <option value="Tops">Tops</option>
          <option value="Dresses">Dresses</option>
          <option value="Activewear">Activewear</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Accessories">Accessories</option>
        </select>

        <label>New Units Sold</label>
        <input type="number" value={newUnitsSold} onChange={(e)=>setNewUnitsSold(e.target.value)}
        placeholder="Enter New Amount of Units Sold"
        />

        <label>New Returns</label>
        <input type="number" value={newReturns} onChange={(e)=>setNewReturns(e.target.value)}
        placeholder="Enter New Amount of Returns"
        />

        <label>New Revenue</label>
        <input type="number" step="0.01" value={newRevenue} onChange={(e)=>setNewRevenue(e.target.value)}
        placeholder="Enter New Amount of Revenue Generated"
        />

        <label>New Customer Rating (0.0 - 5.0)</label>
        <input type="number" step="0.1" value={newRating} onChange={(e)=>setNewRating(e.target.value)}
        placeholder="Enter New Rating"
        />

        <label>New Stock Level</label>
        <input type="number" value={newStock} onChange={(e)=>setNewStock(e.target.value)}
        placeholder="Enter New Level of Stock"
         />
         
        <label>Season</label>
        <select value={newSeason} onChange={(e)=>setNewSeason(e.target.value)} required>
          <option value="">-- Select Season --</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
        </select>

        <label>New Trend Score (0 - 100)</label>
        <input type="number" value={newTrend} onChange={(e)=>setNewTrend(e.target.value)}
        placeholder="Enter New Score"
        />

        <button type="submit">Update Product</button>
      </form>
      
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', marginTop: '15px' }}>{message}</p>}
    </div>
  );
}

export default UpdateProduct;