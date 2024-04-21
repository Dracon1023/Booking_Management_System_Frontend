import React, { useState,useEffect } from 'react';
import { Table } from 'react-bootstrap';
import '../../css/CustomerTransaction.css'

function CustomerTransaction() {
  const [search, setSearch] = useState('');
  const [bookingInfo, setBookingInfo] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const response = await fetch('https://booking-services-aldoub.onrender.com/bookingInfo');
        const data = await response.json();
        setBookingInfo(data);
      } catch (error) {
        console.error('Error fetching booking info:', error);
      }
    };
  
    fetchBookingInfo();
  }, []);
  
  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await fetch('https://booking-services-aldoub.onrender.com/paymentInfo');
        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        console.error('Error fetching payment info:', error);
      }
    };
  
    fetchPaymentInfo();
  }, []);

  useEffect(() => {
    const combinedData = paymentInfo.map(payment => {
        const booking = bookingInfo.find(b => b.transactionID === payment.transactionID);
        
        if (!booking) {
          console.error(`No booking found for transaction ID ${payment.transactionID}`);
          return null;
        }
      
        return {
          transactionID: payment.transactionID,
          email: payment.email,
          name: `${payment.firstname} ${payment.lastname}`,
          movie: booking.movie,
          date: booking.date,
          theatre: booking.theatre,
          seats: booking.seats,
          foodItems: booking.foodItems,
          total: booking.totalCost
        };
      }).filter(item => item !== null);
      

    setData(combinedData);
  }, [bookingInfo, paymentInfo]);

  const filteredData = data.filter(item => item.transactionID && item.transactionID.includes(search));


  return (
    <div>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Transaction ID" />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Transaction ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Movie</th>
            <th>Date</th>
            <th>Theatre</th>
            <th>Seats</th>
            <th>Food Items</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.transactionID}>
              <td>{index + 1}</td>
              <td>{item.transactionID}</td>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.movie}</td>
              <td>{item.date}</td>
              <td>{item.theatre}</td>
              <td>{item.seats}</td>
              <td>{item.foodItems}</td>
              <td>{item.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CustomerTransaction;