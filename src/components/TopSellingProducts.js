// Task 2.5 Componentt that creates a user interface to display the first 10 records where Unit Sold is greater than a given value. (Used Endpoint created in Task 1.9)

import React, { useState } from "react";
import "./FormStyle.css"; 
// Here I imported the api helper so I can easily send requests to the backend
import api from "../api"; 

function TopSellingProducts() {
  // These variables hold the search filters: the season and the minimum sales number
  const [season, setSeason] = useState("");
  const [minSales, setMinSales] = useState("");
  // This array will hold the list of top-selling products that the server sends back
  const [products, setProducts] = useState([]); 
  // This helped me show a loading message while waiting for the server
  const [loading, setLoading] = useState(false);
  // If something goes wrong, I save the error message here
  const [error, setError] = useState(null);

  async function handleFetch(e) {
    // Stops the form from refreshing the page automatically
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProducts([]); 

    try {
      // I send a GET request to the highSales endpoint
      // I use 'params' so Axios puts the values into the URL for me
      const response = await api.get("/api/highSales", {
        params: {
          season: season,
          minSales: Number(minSales) // I made sure to send this as a number, not a string
        }
      });

      const data = response.data;

      // I checked if the data is a real array and if it has items inside
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        // If the array is empty, it means no products matched the search
        setError("No products found meeting these criteria.");
      }

    } catch (err) {
      console.error("ERROR fetching top sellers:", err);
      setError("Failed to fetch data. Check your connection.");
    } finally {
      // I always turn off the loading state when the request is finished
      setLoading(false);
    }
  }


 // HTML

  return (
    <div className="form-container">
      <h2>Top Selling Products</h2>
      <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>
        Finds the first 10 products with sales higher than your threshold.
      </p>

      <form onSubmit={handleFetch}>
        <label>Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)} required>
          <option value="">-- Select Season --</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
          </select>

        <label>Minimum Units Sold</label>
        <input 
          type="number" 
          value={minSales} 
          onChange={(e) => setMinSales(e.target.value)} 
          required 
          placeholder="e.g. 50"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find Top Sellers'}
        </button>
      </form>

      {/* If there is an error, I show it here in red text */}
      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {/* I only show the table if we actually found products */}
      {products.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Top Results (Limit 10)</h3>
          
          {/* I created a table to display the product details neatly */}
          <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Product Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Units Sold</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {/* I looped through the products array to create a row for each item */}
              {products.map((item) => (
                <tr key={item._id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productName}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productCategory}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>{item.unitsSold}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>£{item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TopSellingProducts;