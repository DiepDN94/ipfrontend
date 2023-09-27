import React, { useEffect, useState } from 'react';
import api from './api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
      fetchCustomers(searchText);
    }, [searchText]);

    const fetchCustomers = async (search) => {
        try {
          const response = await api.get(`/customer?search=${search}`);
          setCustomers(response.data);
        } catch (err) {
          console.error("Error fetching customers:", err);
        }
    };

    const handleSearch = () => {
      fetchCustomers(searchText);
    };

  return (
    <div>

      <div>
        <label>
          Search:
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(customer => (
            <tr key={customer.customer_id}>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
    </div>
  );
}
 
export default Customers;
