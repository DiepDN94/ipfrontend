import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';
import api from '../api';

jest.mock('../api'); // Mock the API module

describe('<Home />', () => {

  it('displays top 5 actors after fetching', async () => {
    const mockActors = [
      { actor_id: 1, first_name: 'John', last_name: 'Doe', film_count: 5 },
      { actor_id: 2, first_name: 'Jane', last_name: 'Smith', film_count: 10 },
      { actor_id: 3, first_name: 'Robert', last_name: 'Brown', film_count: 7 },
      { actor_id: 4, first_name: 'Linda', last_name: 'Johnson', film_count: 8 },
      { actor_id: 5, first_name: 'Michael', last_name: 'Williams', film_count: 6 }
    ];

    const mockFilms = [
      { film_id: 1, title: 'Film A', rental_count: 11 },
      { film_id: 2, title: 'Film B', rental_count: 20},
      { film_id: 3, title: 'Film C', rental_count: 5 },
      { film_id: 4, title: 'Film D', rental_count: 1 },
      { film_id: 5, title: 'Film F', rental_count: 8 }
    ];

    api.get.mockImplementation((url) => {
      switch (url) {
        case '/top5Actors':
          return Promise.resolve({ data: mockActors });
        case '/top5Films':
          return Promise.resolve({ data: mockFilms });
        default:
          return Promise.reject(new Error('Not mocked'));
      }
    });

    const { getByText } = render(<Home />);

    await waitFor(() => {
      // Check if films are displayed
      mockFilms.forEach(film => {
        const filmTitle = `${film.title} (${film.rental_count} rentals)`;
        expect(getByText(filmTitle)).toBeInTheDocument();
      });

      // Check if actors are displayed
      mockActors.forEach(actor => {
        const actorName = `${actor.first_name} ${actor.last_name} (${actor.film_count} films)`;
        expect(getByText(actorName)).toBeInTheDocument();
      });
    });
  });

  // You can further extend this by testing interactions (clicking on actors or films to fetch details, etc.)
});
