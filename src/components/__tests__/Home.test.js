import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../Home';
import api from '../api';

//https://stackoverflow.com/questions/73958968/cannot-use-import-statement-outside-a-module-with-axios
//rcbevans my beloved
jest.mock('../api'); //Mock the api since it contains axios

describe('<Home />', () => {

  // clear mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays top 5 actors and top 5 films after fetching', async () => {

    // mock the actors
    const mockActors = [
      { actor_id: 1, first_name: 'John', last_name: 'Doe', film_count: 5 },
      { actor_id: 2, first_name: 'Jane', last_name: 'Roe', film_count: 10 },
      { actor_id: 3, first_name: 'Jan', last_name: 'Boe', film_count: 7 },
      { actor_id: 4, first_name: 'Jamall', last_name: 'Shoe', film_count: 8 },
      { actor_id: 5, first_name: 'Jekyll', last_name: 'Yu', film_count: 6 },
      { actor_id: 6, first_name: 'Johan', last_name: 'Futenma', film_count: 3 },
      { actor_id: 7, first_name: 'Pendleton', last_name: 'Foster', film_count: 1 }
    ];
   
    // mock the films
    const mockFilms = [
      { film_id: 1, title: 'Film A', rental_count: 11 },
      { film_id: 2, title: 'Film B', rental_count: 20},
      { film_id: 3, title: 'Film C', rental_count: 5 },
      { film_id: 4, title: 'Film D', rental_count: 1 },
      { film_id: 5, title: 'Film F', rental_count: 4 },
      { film_id: 6, title: 'Film F', rental_count: 3 },
      { film_id: 7, title: 'Film F', rental_count: 0 }
    ];

    // mock api get
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
      mockFilms.forEach(film => {
        const filmTitle = `${film.title} (${film.rental_count} rentals)`;
        expect(getByText(filmTitle)).toBeInTheDocument();
      });

      mockActors.forEach(actor => {
        const actorName = `${actor.first_name} ${actor.last_name} (${actor.film_count} films)`;
        expect(getByText(actorName)).toBeInTheDocument();
      });
    });
  });

});
