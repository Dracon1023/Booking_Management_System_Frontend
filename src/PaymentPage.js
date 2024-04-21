import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/PaymentPage.css";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function PaymentPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); //Autofill this if user is logged in
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [cardnumber, setCardnumber] = useState("");
  const [expdate, setExpdate] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleCardnumberChange = (event) => {
    setCardnumber(event.target.value);
  };

  const handleExpdateChange = (event) => {
    setExpdate(event.target.value);
  };

  const handleCvcChange = (event) => {
    setCvc(event.target.value);
  };

  const handleZipChange = (event) => {
    setZip(event.target.value);
  };

  const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
  const totalSeats = JSON.parse(localStorage.getItem('totalSeats'));
  const seatNumbers = JSON.parse(localStorage.getItem('seatNumbers')).sort((a, b) => a - b);
  const foodItems = JSON.parse(localStorage.getItem('cart'));
  const selectedTime = localStorage.getItem('selectedTime');
  const selectedDate = localStorage.getItem('date');
  const selectedTheatre = localStorage.getItem('theatre');

  const moviePrice = selectedMovie.price;
  const validSeatNumbers = Array.isArray(seatNumbers) ? seatNumbers : [];
  const validFoodItems = Array.isArray(foodItems) ? foodItems : [];

  var transactionID = 'TRANS-' + Date.now();

  const getBookingDetails = () => {
    const country = localStorage.getItem('country');
    /*let totalCost = moviePrice * totalSeats +
      validFoodItems.reduce((total, item) => total + (parseFloat(item.price || '0') * parseInt(item.quantity || '0')), 0);
    totalCost = isNaN(totalCost) ? '0.00' : totalCost.toFixed(2);*/
    let totalCost = localStorage.getItem('totalCost')
    const currencySymbol = country === 'India' ? '₹' : '$';

    return {
      transactionID: transactionID,
      movie: selectedMovie.title,
      time: selectedTime,
      date: selectedDate,
      theatre: selectedTheatre,
      seats: validSeatNumbers.join(', '),
      foodItems: validFoodItems.map(item => `${item.name} x${item.quantity}`).join(', '),
      totalCost: `${currencySymbol}${totalCost}`
    };
  };


  const handleSendEmail = async (bookingDetails, userEmail, firstname) => {
    try {
      const response = await fetch('https://booking-services-aldoub.onrender.com/send-email', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingDetails, userEmail, firstname }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    

    var paymentDetails = JSON.stringify({
      "transactionID": transactionID,
      "email": email,
      "firstname": firstname,
      "lastname": lastname,
      "cardnumber": cardnumber,
      "expdate": expdate,
      "cvc": cvc,
      "zip": zip
    });
    var bookingDetails = getBookingDetails();
    fetch('https://booking-services-aldoub.onrender.com/paymentInfo', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: paymentDetails
    })
      .then(async response => {
        if (response.status == 200) {
          //navigate to payment success page
          navigate('/confirmation')
        } else {
          //notify user of failed payment attempt
        }
      })
      .catch(error => {
        console.log(error)
      });

    fetch('https://booking-services-aldoub.onrender.com/bookingInfo', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingDetails)
    })
      .then(async response => {
        if (response.status != 200) {
          //notify user of failed booking details submission
        }
      })
      .catch(error => {
        console.log(error)
      });

    handleSendEmail(bookingDetails, email, firstname);
  };


  const appId = "385141384216301";
  const success = (response) => {
    console.log("success");
    console.log(response);
  };
  const failure = (response) => {
    console.log("failure");
    console.log(response);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <div className="center">
      <div className="container">
        <h2>Payment Details</h2>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={2} rowSpacing={1} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
              <input
                className="payData"
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email Address"
              />
            </Grid>
            <Grid item xs={6}>
              <input
                className="payData"
                type="text"
                value={firstname}
                onChange={handleFirstnameChange}
                placeholder="First Name"
              />
            </Grid>
            <Grid item xs={6}>
              <input
                className="payData"
                type="text"
                value={lastname}
                onChange={handleLastnameChange}
                placeholder="Last Name"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                className="payData"
                type="text"
                value={cardnumber}
                onChange={handleCardnumberChange}
                placeholder="Card Number"
              />
            </Grid>
            <Grid item xs={4}>
              <input
                className="payData"
                type="text"
                value={expdate}
                onChange={handleExpdateChange}
                placeholder="Expiration Date"
              />
            </Grid>
            <Grid item xs={4}>
              <input
                className="payData"
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="CVC"
              />
            </Grid>
            <Grid item xs={4}>
              <input
                className="payData"
                type="text"
                value={zip}
                onChange={handleZipChange}
                placeholder="ZIP"
              />
            </Grid>
          </Grid>
        </Box>
        <button id="submitBtn" onClick={handleSubmit}>
          Submit Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;