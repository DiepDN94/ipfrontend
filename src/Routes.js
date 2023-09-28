import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Customers from './components/Customers';
import Home from './components/Home';
import Movies from './components/Movies';
import ReportButton from './components/ReportButton'; 

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
