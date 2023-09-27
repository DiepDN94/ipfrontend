import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Customers from './Customers';
import Home from './Home';
import Movies from './Movies';
import ReportButton from './ReportButton'; 

const RoutesConfig = () => {
  return (
    <div>
      <ReportButton />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/movies" element={<Movies/>} />
      </Routes>
    </div>
  );
};

export default RoutesConfig;
