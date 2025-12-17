// Task 2.3 Component that creates a user interface to show total Units Sold, Returns, and Revenue for a given season. (Used Endpoint created in Task 1.8)

import React, { useState } from "react";
import "./FormStyle.css"; 
// Here I imported the api instance so I can make requests to the backend.
import api from "../api"; 

function SalesSummary() {
  // These state variables will store what the user types and what the server sends back
  const [season, setSeason] = useState("");
  const [summary, setSummary] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFetchSummary(e) {
    // This prevents the page from reloading when the button is clicked
    e.preventDefault();
    setLoading(true);
    setSummary(null);
    setError(null);

    // Here I cleaned up the input just in case there are extra spaces
    const formattedSeason = season.trim();

    try {
      // Here I sent a GET request to the stats endpoint, passing the season in the URL
      const response = await api.get(`/api/stats/${formattedSeason}`);
      
      // I checked if the server actually sent back the data object inside the response
      if (response.data && response.data.data && response.data.data._id) {
          setSummary(response.data.data); 
      } else {
          // If the request worked but there was no data inside, I set an error
          setError("Server returned success but data was empty.");
      }
      
    } catch (err) {
      console.error("ERROR fetching sales summary:", err.response || err);
      
      // If the backend sends a specific error message (like 'Season not found'), I use this
      const errorMessage = err.response?.data?.message || "Failed to connect to server or API endpoint.";
      
      setError(errorMessage);
    } finally {
      // Whether it worked or failed, I need to turn off the loading state
      setLoading(false);
    }
  }

  
//HTML

  return (
    <div className="form-container">
      <h2>Sales Summary by Season</h2>

      <form onSubmit={handleFetchSummary}>
        <select value={season} onChange={(e) => setSeason(e.target.value)} required>
          <option value="">-- Select Season --</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Autumn">Autumn</option>
          <option value="Winter">Winter</option>
          </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Fetching...' : 'Get Summary'}
        </button>
      </form>

      {/* If there is an error, I show it here in red text */}
      {error && <p style={{ color: 'red', marginTop: '15px', fontWeight: 'bold' }}>Error: {error}</p>}
      
      {/* I only show this section if we successfully got the summary data */}
      {summary && (
        <div className="results-table" style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '15px' }}>
          <h3>Results for {summary._id}</h3>
          
          <p>Total Units Sold: <strong>{Math.round(summary.totalUnitsSold).toLocaleString()}</strong></p>
          <p>Total Returns: <strong>{Math.round(summary.totalReturns).toLocaleString()}</strong></p>
          <p>Total Revenue: <strong>£{Math.round(summary.totalRevenue).toLocaleString()}</strong></p>
        </div>
      )}
    </div>
  );
}

export default SalesSummary;