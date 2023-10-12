import React, { useState } from 'react';
import api from './api';

const AddCustomer = () => {
  const [customerDetails, setCustomerDetails] = useState({
      store_id: '',
      first_name: '',
      last_name: '',
      email: '',
      address_id: '',
      active: true
  });

  const handleSubmit = async () => {
    if (!/^[a-zA-Z0-9 ]*$/.test(customerDetails.store_id) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.first_name) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.last_name) ||
      !/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(customerDetails.email) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.country) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.city) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.address) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.district) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.address2) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.postal_code) ||
      !/^[a-zA-Z0-9 ]*$/.test(customerDetails.phone)
    ) {
      alert('Invalid input. Please ensure the fields are alphanumeric (Email is an exception example@example.com).');
      return;
    }
    try {
        const response = await api.post('/addCustomer', customerDetails);
        if (response.data.success) {
            alert('Customer added successfully!');
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        alert('Error adding customer.');
    }
  };

  return (
      <div>
          <h2>Add New Customer</h2>
          <div>
              <label>Store ID: <input type="text" required value={customerDetails.store_id} onChange={(e) => setCustomerDetails({ ...customerDetails, store_id: e.target.value })} /></label>
              <label>First Name: <input type="text" required value={customerDetails.first_name} onChange={(e) => setCustomerDetails({ ...customerDetails, first_name: e.target.value })} /></label>
              <label>Last Name: <input type="text" required value={customerDetails.last_name} onChange={(e) => setCustomerDetails({ ...customerDetails, last_name: e.target.value })} /></label>
              <label>Email: <input type="email" required value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} /></label>
              <label>Country: <input type="text" required value={customerDetails.country} onChange={(e) => setCustomerDetails({ ...customerDetails, country: e.target.value })} /></label>
              <label>City: <input type="text" required value={customerDetails.city} onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })} /></label>
              <label>Address: <input type="text" required value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} /></label>
              <label>District: <input type="text" required value={customerDetails.district} onChange={(e) => setCustomerDetails({ ...customerDetails, district: e.target.value })} /></label>
              
              <label>Address 2: <input type="text" value={customerDetails.address2 || ''} placeholder="Optional" onChange={(e) => setCustomerDetails({ ...customerDetails, address2: e.target.value })} /></label>
              <label>Postal Code: <input type="text" value={customerDetails.postal_code || ''} placeholder="Optional" onChange={(e) => setCustomerDetails({ ...customerDetails, postal_code: e.target.value })} /></label>
              <label>Phone: <input type="text" value={customerDetails.phone || ''} placeholder="Optional" onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} /></label>
              <label>Active: <input type="checkbox" checked={customerDetails.active} onChange={(e) => setCustomerDetails({ ...customerDetails, active: e.target.checked })} /></label>
              <button onClick={handleSubmit}>Add Customer</button>
          </div>
      </div>
  );
};

export default AddCustomer;
