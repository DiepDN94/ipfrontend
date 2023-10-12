import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import api from './api';
import AddCustomer from './AddCustomer';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [rentedMovies, setRentedMovies] = useState([]);

  useEffect(() => {}, []);

  const handleValueChange = (newValue, customerId, fieldName) => {
    setCustomers(prevCustomers => {
        return prevCustomers.map(customer => {
            if (customer.customer_id === customerId) {
                return { ...customer, [fieldName]: newValue };
            } else {
                return customer;
            }
        });
    });
  };

  const EditableCell = ({ value, onValueChange, fieldName, customerId }) => {
    const [inputValue, setInputValue] = useState(value);
  
    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };
 
    const handleUpdateDatabase = async () => {
      
      onValueChange(inputValue, customerId, fieldName); 
      try {
        await api.post('/updateCustomerDetails', {
          customerId,
          fieldName,
          newValue: inputValue
        });
      } catch (err) {
        console.error("Error updating customer details:", err);
      }
    };
  
    return (
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()}
        onBlur={handleUpdateDatabase}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleUpdateDatabase();
          }
        }}
      />
    );
  };
  
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
  
  const handleDelete = async (customerId) => {
    try {
        const response = await api.post('/deleteCustomer', { customerId });
        if (response.data.success) {
            setCustomers(customers.filter(c => c.customer_id !== customerId));
        } else {
            alert(response.data.message || 'Failed to delete customer.');
        }
    } catch (err) {
        console.error("Error deleting customer:", err);
        alert('Error deleting customer.');
    }
  };

  const openAddCustomerForm = () => {
    const newWindow = window.open("", "Add Customer", "width=600,height=600");
    newWindow.document.write('<html><head><title>Add Customer</title></head><body>');
    newWindow.document.write('<div id="root"></div>');
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    ReactDOM.render(<AddCustomer />, newWindow.document.getElementById("root"));
  }
 
  const handleReturnMovie = async (rentalId) => {
    console.log("Attempting to return movie with rentalId:", rentalId);  // Add this line
    try {
      const response = await api.post('/returnMovie', {rentalId});
      if (response.data.success) {
        fetchCustomerDetails(selectedCustomer.customer_id);
        alert('Movie successfully returned.');
      } else {
        alert(response.data.message || 'Failed to return movie.');
      }
    } catch (err) {
      console.error("Error returning movie:", err);
      alert('Error returning movie.');
    }
  };
  
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await api.get(`/customerDetails/${customerId}`);
      console.log("Fetched details:", response.data);  // Add this line
      setSelectedCustomer(response.data.customer);
      setRentedMovies(response.data.rentedMovies);
    } catch (err) {
      console.error("Error fetching customer details and rented movies:", err);
    }
  };
  
  
  return (
    <div>

    <button onClick={openAddCustomerForm}>Add New Customer</button>

    <div>
      <label>
        Search:
        <input
          type="text"
          value={searchText}
          placeholder="Enter first, last, or email" 
          onChange={(e) => setSearchText(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>City</th>
          <th>District</th> 
          <th>Country</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => (
          <tr key={customer.customer_id} onClick={() => fetchCustomerDetails(customer.customer_id)} style={{ cursor: 'pointer' }}>
            <td>{customer.customer_id}</td>
            <td><EditableCell value={customer.first_name} fieldName="first_name" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.last_name} fieldName="last_name" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.email} fieldName="email" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.address} fieldName="address" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.district} fieldName="district" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.city} fieldName="city" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.country} fieldName="country" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><EditableCell value={customer.phone} fieldName="phone" customerId={customer.customer_id} onValueChange={handleValueChange} /></td>
            <td><button onClick={() => handleDelete(customer.customer_id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>

    </table>
    
    {selectedCustomer && (
      <div>
        <h3>Rented Movies by {selectedCustomer.first_name} {selectedCustomer.last_name}</h3>
        <table>
          <thead>
            <tr>
              <th>Movie ID</th>
              <th>Movie Title</th>
              <th>Return Movie</th>
            </tr>
          </thead>
          <tbody>
            {rentedMovies.map((movie) => (
              <tr key={movie.film_id}>
                <td>{movie.film_id}</td>
                <td>{movie.title}</td>
                <td>
                  <button onClick={() => handleReturnMovie(movie.rental_id)} >
                    Return Movie
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    </div>
  );
};

export default Customers;
