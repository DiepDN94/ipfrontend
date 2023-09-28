import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Movies from '../Movies';
import api from '../api';

jest.mock('../api');

describe('<Movies />', () => {
    afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('displays movies after search', async () => {
    const mockGenres = [
      'Action',
      'Adventure',
      'Comedy'
    ];

    const mockMovies = [
      { film_id: 1, title: 'Film A', available_copies: 5 },
      { film_id: 2, title: 'Test 1', available_copies: 2 },
      { film_id: 3, title: 'Film A', available_copies: 3 },
      { film_id: 4, title: 'Test 2', available_copies: 1 },
      { film_id: 5, title: 'Test8', available_copies: 3 },
      { film_id: 6, title: 'test', available_copies: 5 },
      { film_id: 7, title: 'tEsT', available_copies: 5 },
    ];

    api.get.mockImplementation((url) => {
      switch (url) {
        case '/getGenres':
          return Promise.resolve({ data: mockGenres.map(name => ({ name })) });
        case '/searchMovies':
          return Promise.resolve({ data: mockMovies });
        default:
          return Promise.reject(new Error(`Not mocked for URL: ${url}`));
      }
    });
    

    const { getByText, getByPlaceholderText } = render(<Movies />);

    // Wait for genres to be fetched
    await waitFor(() => {
      expect(getByText('Select Genre')).toBeInTheDocument();
    });

    // Set film name to Test and trigger the search
    fireEvent.change(getByPlaceholderText('Search by film name...'), { target: { value: 'Test' } });
    fireEvent.click(getByText('Search'));

    // Wait for the movies to be displayed
    await waitFor(() => {
      mockMovies.forEach(movie => {
        const movieTitle = `${movie.title} - Available Copies: ${movie.available_copies}`;
        expect(getByText(movieTitle)).toBeInTheDocument();
      });
    });
  });

});
