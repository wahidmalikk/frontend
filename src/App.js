import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddProduct from './components/AddProduct';       // Task 2.1 (Fuad)
import UpdateProduct from './components/UpdateProduct'; // Task 2.2 (Fuad)
import SalesSummary from './components/SalesSummary';   // Task 2.3 (Wahid)
import DeleteProduct from './components/DeleteProduct'; // Task 2.4 (Wahid)
import TopSellingProducts from './components/TopSellingProducts'; // Task 2.5 (Farrukh)
import RatingFilter from './components/RatingFilter';           // Task 2.6 (Farrukh)

import './App.css'; 

function App() {
  return (
    // 1. BrowserRouter wraps the entire application to enable routing
    <Router>
      <div className="App">
        {/* 2. Navigation Bar: Persistent across all routes Task 2.7 integration (Fuad, Wahid & Farrukh) */}
        <nav className="nav-bar">
          {/* Brand wrapped in Link to navigate back to Home */}
          <Link to="/" className="nav-brand-link">
            <div className="nav-brand">Fashion Shop API</div>
          </Link>
          
          <div className="nav-links">
            <Link to="/">Home</Link>
            {/* CRUD Operations */}
            <Link to="/add">Add</Link>           {/* Task 2.1 */}
            <Link to="/update">Update</Link>     {/* Task 2.2 */}
            <Link to="/delete">Delete</Link>     {/* Task 2.4 */}
            {/* Reporting/Display Functions */}
            <Link to="/summary">Sales Summary</Link>     {/* Task 2.3 */}
            <Link to="/top-selling">Top Sellers</Link>   {/* Task 2.5 */}
            <Link to="/rating-filter">Rating Filter</Link> {/* Task 2.6 */}
          </div>
        </nav>

        {/* 3. Routes: Define which component loads based on the URL path */}
        <Routes>
          {/* Home Route*/}
          <Route path="/" element={
            <div className="home-wrapper">
              <div className="home-content">
                <header className="home-header">
                  <span className="subtitle">ESTABLISHED 2025</span>
                  <h1>FASHION SHOP REST API</h1>
                  <div className="divider"></div>
                  {/* Centered CTA Button to guide user to Task 2.1 */}
                  <Link to="/add" className="home-cta-button">
                    ADD PRODUCT
                  </Link>
                </header>
              </div>
            </div>
          } />
          
          {/* Routes for functional components created in previous tasks */}
          <Route path="/add" element={<AddProduct />} />
          <Route path="/update" element={<UpdateProduct />} />
          <Route path="/delete" element={<DeleteProduct />} />
          <Route path="/summary" element={<SalesSummary />} />
          <Route path="/top-selling" element={<TopSellingProducts />} />
          <Route path="/rating-filter" element={<RatingFilter />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;