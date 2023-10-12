import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';
import api from '../api';

jest.mock('../api');

describe('<Home />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock only top 5 actors
  const mockActors = [
    { actor_id: 1, first_name: 'John', last_name: 'Doe', film_count: 5 },
    { actor_id: 2, first_name: 'Jane', last_name: 'Roe', film_count: 10 },
    { actor_id: 3, first_name: 'Jan', last_name: 'Boe', film_count: 7 },
    { actor_id: 4, first_name: 'Jamall', last_name: 'Shoe', film_count: 8 },
    { actor_id: 5, first_name: 'Jekyll', last_name: 'Yu', film_count: 6 },
  ];
  
  // Mock only top 5 films
  const mockFilms = [
    { film_id: 1, title: 'Film A', rental_count: 11 },
    { film_id: 2, title: 'Film B', rental_count: 20},
    { film_id: 3, title: 'Film C', rental_count: 5 },
    { film_id: 4, title: 'Film D', rental_count: 1 },
    { film_id: 5, title: 'Film F', rental_count: 4 }
  ];
  
  it('displays top 5 actors and top 5 films after fetching', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/top5Actors') {
        return Promise.resolve({ data: mockActors });
      } else if (url === '/top5Films') {
        return Promise.resolve({ data: mockFilms });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    const { findByText } = render(<Home />);

    for (const film of mockFilms) {
      const filmTitle = `${film.title} (${film.rental_count} rentals)`;
      expect(await screen.findByText(filmTitle)).toBeInTheDocument();
    }

    for (const actor of mockActors) {
      const actorName = `${actor.first_name} ${actor.last_name} (${actor.film_count} films)`;
      expect(await screen.findByText(actorName)).toBeInTheDocument();
    }
  });
  
});