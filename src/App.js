import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Routes from './Routes'; // Update the path if you place it in a different directory

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
            </li>
            <li>
              <Link to="/movies">Movies</Link>
            </li>
          </ul>
        </nav>

        <Routes />
      </div>
    </Router>
  );
}

export default App;
