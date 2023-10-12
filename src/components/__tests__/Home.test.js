import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

  const mockFilmDetails = {
    title: 'Film A',
    description: 'A great film about adventures.',
    release_year: '2020',
    language: 'English',
    rating: 'PG'
  };
  
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

    // Check for film (#numberof rentals)
    for (const film of mockFilms) {
      const filmTitle = `${film.title} (${film.rental_count} rentals)`;
      expect(await screen.findByText(filmTitle)).toBeInTheDocument();
    }

    // Check for actors and formatting first last (#numberof films)
    for (const actor of mockActors) {
      const actorName = `${actor.first_name} ${actor.last_name} (${actor.film_count} films)`;
      expect(await screen.findByText(actorName)).toBeInTheDocument();
    }
  });

  it('fetches and displays film details when a film is clicked', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/top5Actors') {
        return Promise.resolve({ data: mockActors });
      } else if (url === '/top5Films') {
        return Promise.resolve({ data: mockFilms });
      } else if (url.includes('/filmDetails/')) {
        return Promise.resolve({ data: mockFilmDetails });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Home />);

    // Wait for films to render
    await waitFor(() => screen.getByText('Film A (11 rentals)'));

    // Click on the first film title
    fireEvent.click(screen.getByText('Film A (11 rentals)'));

    // Check if film details are displayed
    await waitFor(() => screen.getByText('Film Details'));
    expect(screen.getByText(`Title: ${mockFilmDetails.title}`)).toBeInTheDocument();
    expect(screen.getByText(`Description: ${mockFilmDetails.description}`)).toBeInTheDocument();
    expect(screen.getByText(`Release Year: ${mockFilmDetails.release_year}`)).toBeInTheDocument();
    expect(screen.getByText(`Language: ${mockFilmDetails.language}`)).toBeInTheDocument();
    expect(screen.getByText(`Rating: ${mockFilmDetails.rating}`)).toBeInTheDocument();
  });
});
