// Task 2.6 A component that creates a user interface to display all products where average Customer Rating for a given Season meets a condition. (Used Endpoint created in Task 1.10)
import React, { useState } from "react";
// Imported the CSS file for styling
import "./FormStyle.css"; 
// Imported the axios api instance
import api from "../api"; 

function RatingFilter() {
  // Initialized state variables to store user inputs, API data, loading status, and error messages
  const [season, setSeason] = useState("");
  const [minRating, setMinRating] = useState("");
  const [products, setProducts] = useState([]);
  const [resultMessage, setResultMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Defined the asynchronous function that handled the form submission logic
  async function handleFetch(e) {
    // Prevented the default form submission behavior to stop page reload
    e.preventDefault();
    // Set the loading state to true and cleared previous results and errors
    setLoading(true);
    setError(null);
    setResultMessage("");
    setProducts([]);

    try {
      // Sent a GET request to the backend with the season and minAvgRating as query parameters
      const response = await api.get("/api/avgRatingCheck", {
        params: {
          season: season,
          minAvgRating: Number(minRating) 
        }
      });

      // Captured the response data
      const data = response.data;
      
      // Updated the state with the message returned from the server
      setResultMessage(data.message); 

      // Checked if the response contained a products array and updated the products state
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      }

    } catch (err) {
      // Logged the error to the console for debugging
      console.error("ERROR fetching rating check:", err);
      // Determined the error message from the response or used a default message
      const errorMsg = err.response?.data?.message || "Error checking ratings. Verify season name.";
      // Updated the error state to display it to the user
      setError(errorMsg);
    } finally {
      // Reset the loading state back to false
      setLoading(false);
    }
  }

  // Created a helper function that formatted the revenue numbers and replaced the decimal point with a comma
  const formatRevenue = (value) => {
    const standardFormat = value.toLocaleString('en-GB', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    return standardFormat.replace('.', ',');
  };


 // HTML
  return (
    <div className="form-container">
      <h2>Rating Filter</h2>
      <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>
        Shows products ONLY if the Season's Average Rating is higher than your input.
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

        <label>Minimum Average Rating (0-5)</label>
        <input 
          type="number" 
          step="0.1" 
          min="0" 
          max="5"
          value={minRating} 
          onChange={(e) => setMinRating(e.target.value)} 
          required 
          placeholder="e.g. 3.5"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check Ratings'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}

      {/* Conditionally rendered the server response message if it existed */}
      {resultMessage && (
        <div style={{ 
            marginTop: '15px', 
            padding: '10px', 
            backgroundColor: '#e7f3fe', 
            borderLeft: '6px solid #2196F3',
            color: '#0c5460'
        }}>
            <strong>Server Response:</strong> {resultMessage}
        </div>
      )}
      
      {/* Conditionally rendered the results table if the products array was not empty */}
      {products.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Qualifying Products</h3>
          <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Product Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Rating</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productName}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>{item.customerRating}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    £{formatRevenue(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Exported the component for use in the application
export default RatingFilter;