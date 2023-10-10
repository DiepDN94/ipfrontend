import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from './api';
import AddCustomer from './AddCustomer';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCustomers(searchText);
  }, [searchText]);


  const fetchCustomers = async (search) => {
    try {
      const response = await api.get(`/getCustomer?search=${search}`);
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleSearch = () => {
    fetchCustomers(searchText);
  };

  const openAddCustomerForm = () => {
    const newWindow = window.open("", "Add Customer", "width=600,height=600");
    newWindow.document.write('<html><head><title>Add Customer</title></head><body>');
    newWindow.document.write('<div id="root"></div>');
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    ReactDOM.render(<AddCustomer />, newWindow.document.getElementById("root"));
  }

  return (
    <div>

      <button onClick={openAddCustomerForm}>Add New Customer</button>

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
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
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
};

export default Customers;
