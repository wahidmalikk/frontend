// Task 2.4 Component that creates a user interface for deleting a record for a given Product Name. (Used Endpoint created in Task 1.7)

import React, { useState } from "react";
import "./FormStyle.css";
// Here I imported the axios instance to send requests to the backend
import api from "../api"; 

function DeleteProduct() {
  // This state holds the name of the product the user types in
  const [productName, setProductName] = useState("");
  // This state is for showing feedback messages (success or error)
  const [message, setMessage] = useState("");
  // This helped me disable the button while the request is happening
  const [loading, setLoading] = useState(false);

  async function handleDelete(e) {
    // Prevents the form from reloading the page
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Created the object to send to the server
    const payload = { productName };

    try {
      // Here I'm sending a POST request to the delete endpoint
      // If deletion is successful, the code continues to the next line
      await api.post("/api/deleteProduct", payload);
      
      // Since it worked, I show a success message in green
      setMessage(`Successfully deleted product: ${productName}`);
      
      // I cleared the input box so the user can delete another one if they want
      setProductName(""); 

    } catch (err) {
      console.error("ERROR deleting product:", err);
      // I checked if the error is a 404, which means the product wasn't found
      if (err.response && err.response.status === 404) {
        setMessage(`Error: Product '${productName}' not found.`);
      } else {
        // For any other error, I showed a generic message
        setMessage(`Error deleting product. Check server status.`);
      }
    } finally {
      // I always turned off the loading state when the request finishes
      setLoading(false);
    }
  }
  

  //HTML

  return (
    <div className="form-container">
      <h2>Delete Product</h2>
      <p>Enter the exact name of the product you wish to delete.</p>

      <form onSubmit={handleDelete}>
        <label>Product Name (to delete)</label>
        <input 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Record'}
        </button>
      </form>

      {/* I check if the message contains the word "Successfully" to decide the text color */}
      {message && (
        <p style={{ 
          marginTop: '15px', 
          fontWeight: 'bold',
          color: message.includes("Successfully") ? 'green' : 'red' 
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default DeleteProduct;