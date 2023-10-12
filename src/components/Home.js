import React, { useEffect, useState } from 'react';
import api from './api';

const Home = () => {
  const [topFilms, setTopFilms] = useState([]); 
  const [selectedFilmDetails, setSelectedFilmDetails] = useState(null);
  const [topActors, setTopActors] = useState([]);
  const [actorDetails, setActorDetails] = useState({
    actorDetails: null,
    actorMovies: []
  });

  useEffect(() => {
    api.get('/top5Films')
      .then(res => setTopFilms(res.data))
      .catch(err => console.error(err));

    api.get('/top5Actors')
      .then(res => setTopActors(res.data))
      .catch(err => console.error(err));
  }, []);

  //Top 5 Films details
  const fetchFilmDetails = async (film_id) => {
    try {
      const filmRes = await api.get(`/filmDetails/${film_id}`);
      setSelectedFilmDetails(filmRes.data);
    } catch (err) {
      console.error("Error fetching film details or language:", err);
    }
  };

  //Top 5 rented films of actors
  const fetchActorMovies = async (actor_id) => {
    try {
      const response = await api.get(`/actorInfo/${actor_id}`);
      setActorDetails(response.data);
    } catch (err) {
      console.error("Error fetching actor info:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Top 5 Rented Films</h1>
      <ul>
        {topFilms.map(({ film_id, title, rental_count }) => (
          <li key={film_id} onClick={() => fetchFilmDetails(film_id)} style={{ cursor: 'pointer' }}>
            {title} ({rental_count} rentals)
          </li>
        ))}
      </ul>

      {selectedFilmDetails && (
        <div style={{ marginTop: '20px' }}>
          <h2>Film Details</h2>
          <p>Title: {selectedFilmDetails.title}</p>
          <p>Description: {selectedFilmDetails.description}</p>
          <p>Release Year: {selectedFilmDetails.release_year}</p>
          <p>Language: {selectedFilmDetails.language}</p>
          <p>Rating: {selectedFilmDetails.rating}</p>
        </div>
      )}

      <h1>Top 5 Actors</h1>
      <ul>
        {topActors.map(({ actor_id, first_name, last_name, film_count }) => (
          <li key={actor_id} onClick={() => fetchActorMovies(actor_id)} style={{ cursor: 'pointer' }}>
            {first_name} {last_name} ({film_count} films)
          </li>
        ))}
      </ul>

      {actorDetails.actorDetails && (
        <div style={{ marginTop: '20px' }}>
          <h2>Actor's Top 5 Rented Movies</h2>
          <ul>
            {actorDetails.actorMovies.map((film) => (
              <li key={film.film_id}>
                {film.title} ({film.rental_count} rentals)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
