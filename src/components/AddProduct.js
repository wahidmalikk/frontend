// Task 2.1 Component that creates a user interface using a form and HTML elements for adding data 
// (all 9 fields) to the collection in MongoDB through Axios API. (Uses Endpoint created in Task 1.5)

import React, { useState } from "react";
import "./FormStyle.css"; 
import api from "../api"; 

function AddProduct() {
  // State variables for all 9 fields
  const [productCategory, setProductCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [unitsSold, setUnitsSold] = useState("");
  const [returns, setReturns] = useState("");
  const [revenue, setRevenue] = useState("");
  const [customerRating, setCustomerRating] = useState("");
  const [stockLevel, setStockLevel] = useState("");
  const [season, setSeason] = useState("");
  const [trendScore, setTrendScore] = useState("");
  const [message, setMessage] = useState(""); 

  async function handleSubmit(e) {
  e.preventDefault();
  setMessage(""); 

  // 1. SELECT VALIDATION
  if (!productCategory || !season) {
    setMessage("Error: Please select a Category and a Season.");
    return;
  }

  // 2. TEXT VALIDATION
  if (!productName.trim()) {
    setMessage("Error: Product Name cannot be empty.");
    return;
  }

  // 3. NUMERIC VALIDATION (Non-negative checks)
  if (Number(unitsSold) < 0 || Number(returns) < 0 || Number(revenue) < 0 || Number(stockLevel) < 0) {
    setMessage("Error: Sales, returns, revenue, and stock cannot be negative.");
    return;
  }

  // 4. RATING RANGE VALIDATION
  const ratingNum = Number(customerRating);
  if (ratingNum < 0 || ratingNum > 5) {
    setMessage("Error: Customer Rating must be between 0.0 and 5.0.");
    return;
  }

  // 5. TREND SCORE RANGE VALIDATION 
  const trendNum = Number(trendScore);
  if (trendNum < 0 || trendNum > 100) {
    setMessage("Error: Trend Score must be between 0 and 100.");
    return;
  }

  const payload = {
    productCategory,
    productName,
    unitsSold: Number(unitsSold),
    returns: Number(returns),
    revenue: Number(revenue),
    customerRating: ratingNum,
    stockLevel: Number(stockLevel),
    season,
    trendScore: trendNum,
  };

  try {
    await api.post("/api/products", payload);
    setMessage(`Success! Product '${productName}' added.`);
    
    // Clear all fields
    setProductCategory(""); setProductName(""); setUnitsSold(""); setReturns("");
    setRevenue(""); setCustomerRating(""); setStockLevel(""); setSeason(""); setTrendScore("");
  } catch (err) {
    setMessage(`Error adding product: ${err.response?.data?.message || err.message}`);
  }
}

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit}>
        {/* DROPDOWN FOR CATEGORY */}
        <label>Product Category</label>
        <select value={productCategory} onChange={(e)=>setProductCategory(e.target.value)} required>
          <option value="">-- Select Category --</option>
          <option value="Tops">Tops</option>
          <option value="Dresses">Dresses</option>
          <option value="Activewear">Activewear</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Accessories">Accessories</option>
        </select>
        
        <label>Product Name</label>
        <input value={productName} onChange={(e)=>setProductName(e.target.value)} required 
        placeholder="Enter the Product Name"
        />

        <label>Units Sold</label>
        <input type="number" value={unitsSold} onChange={(e)=>setUnitsSold(e.target.value)} required 
        placeholder="Enter Amount of Units Sold"
        />

        <label>Returns</label>
        <input type="number" value={returns} onChange={(e)=>setReturns(e.target.value)} required 
        placeholder="Enter Amount of Returns"
        />

        <label>Revenue</label>
        <input type="number" value={revenue} onChange={(e)=>setRevenue(e.target.value)} required 
        placeholder="Enter Amount of Revenue Generated"
        />

        <label>Customer Rating (0.0 - 5.0)</label>
        <input type="number" step="0.1" value={customerRating} onChange={(e)=>setCustomerRating(e.target.value)} 
        placeholder="Enter Rating"
        />

        <label>Stock Level</label>
        <input type="number" value={stockLevel} onChange={(e)=>setStockLevel(e.target.value)} required 
        placeholder="Enter the Level of Stock"
        />

        {/* DROPDOWN FOR SEASON */}
        <label>Season</label>
        <select value={season} onChange={(e)=>setSeason(e.target.value)} required>
          <option value="">-- Select Season --</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
        </select>

        <label>Trend Score (0 - 100)</label>
        <input type="number" value={trendScore} onChange={(e)=>setTrendScore(e.target.value)} 
        placeholder="Enter Score"
        />
        
        <button type="submit">Add Product</button>
      </form>
      
      {message && (
        <p style={{ color: message.includes('Error') ? 'red' : 'green', marginTop: '15px', fontWeight: 'bold' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default AddProduct;