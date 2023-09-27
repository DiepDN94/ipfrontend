import React, { useState, useEffect } from 'react';
import api from './api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [selectedFilmDetails, setSelectedFilmDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [searchParams, setSearchParams] = useState({
    filmName: '',
    actorName: '',
    genre: ''
  });
  const [cart, setCart] = useState({});
  const [availabilityError, setAvailabilityError] = useState(null);
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');


  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/getGenres');
        setGenres(response.data.map(genre => genre.name)); //gets the available genres from the database for the dropdown
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    })();
  }, []);

  //Search after user clicks search button
  const fetchMovies = async () => {
    try {
      const response = await api.get('/searchMovies', {
        params: searchParams
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchFilmDetails = async (film_id) => {
    try {
      const filmRes = await api.get(`/filmDetails/${film_id}`);
      setSelectedFilmDetails(filmRes.data);
    } catch (err) {
      console.error("Error fetching film details or language:", err);
    }
  };

  const toggleCart = (filmId) => {
    // Find the movie from the movies list
    const movie = movies.find(m => m.film_id === filmId);
  
    if (!movie) return;  // Exit if the movie is not found
  
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
  
      // Ensure cart copies is < available copies
      if ((updatedCart[filmId] && updatedCart[filmId] < movie.available_copies) || !updatedCart[filmId]) {
        if (updatedCart[filmId]) {
          updatedCart[filmId] += 1;
        } else {
          updatedCart[filmId] = 1;
        }
      }
  
      return updatedCart;
    });
  };  

  const rentFilms = async () => {
    if (!customerFirstName || !customerLastName) {
      alert('Please fill out the customer information!');
      return;
    }

    try {
      const response = await api.post('/rent', { 
        films: Object.keys(cart).map(Number), 
        firstName: customerFirstName, 
        lastName: customerLastName 
      });
      
      if (response.data.success) {
        alert('Films rented successfully!');
        setCart({});
        setCustomerFirstName('');
        setCustomerLastName('');
      } else {
        setAvailabilityError(response.data.message);
      }
    } catch (err) {
      alert('Error renting films:', err.message);
    }
};


return (
  <div>
    <input 
      type="text" 
      placeholder="Search by film name..." 
      value={searchParams.filmName} 
      onChange={(e) => setSearchParams({ ...searchParams, filmName: e.target.value })}
    />
    
    <input 
      type="text" 
      placeholder="Search by actor name..." 
      value={searchParams.actorName} 
      onChange={(e) => setSearchParams({ ...searchParams, actorName: e.target.value })}
    />

    <select 
      value={searchParams.genre} 
      onChange={(e) => setSearchParams({ ...searchParams, genre: e.target.value })}
    >
      <option value="">Select Genre</option>
      {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
    </select>

    <button onClick={fetchMovies}>Search</button>

    <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
      <h3>Customer Info</h3>
      <form>
        <div>
          <label>First Name: </label>
          <input 
            type="text" 
            value={customerFirstName}
            onChange={(e) => setCustomerFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name: </label>
          <input 
            type="text" 
            value={customerLastName}
            onChange={(e) => setCustomerLastName(e.target.value)}
          />
        </div>
      </form>
    </div>

    <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
      <h3>Cart</h3>
      {Object.keys(cart).length === 0 ? (
        <p>No films in the cart.</p>
      ) : (
        <ul>
          {movies
            .filter(movie => cart[movie.film_id])
            .map(movie => (
              <li key={movie.film_id}>
                {movie.title} (x{cart[movie.film_id]}) 
                <button onClick={() => toggleCart(movie.film_id)}>Remove one copy</button>
              </li>
            ))}
        </ul>
      )}
      {Object.keys(cart).length > 0 && <button onClick={rentFilms}>Rent Selected Films</button>}
    </div>

    {selectedFilmDetails && (
      <div style={{ marginTop: '20px' }}>
        <h2>Film Details</h2>
        <p><strong>Title:</strong> {selectedFilmDetails.title}</p>
        <p><strong>Description:</strong> {selectedFilmDetails.description}</p>
        <p><strong>Release Year:</strong> {selectedFilmDetails.release_year}</p>
        <p><strong>Language:</strong> {selectedFilmDetails.language}</p>
        <p><strong>Rating:</strong> {selectedFilmDetails.rating}</p>
      </div>
    )}

    {availabilityError && <div style={{ color: 'red' }}>{availabilityError}</div>}
    
    <div>
      <h2>Movies</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie.film_id}>
            <span onClick={() => fetchFilmDetails(movie.film_id)} style={{ cursor: 'pointer', marginRight: '10px' }}>
              {movie.title} - Available Copies: {movie.available_copies}
            </span>
            <button onClick={() => toggleCart(movie.film_id)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
};

export default Movies;
