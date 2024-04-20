import React, { useState, useEffect } from 'react';
import '../../css/CartItems.css';
import { useNavigate } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const CartItems = () => {

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [displayPrice, setDisplayPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [updatedTotalCost, setUpdatedTotalCost] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Retrieve the selected movie, seats, food items, and time from local storage
  const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
  const totalSeats = JSON.parse(localStorage.getItem('totalSeats'));
  const seatNumbers = JSON.parse(localStorage.getItem('seatNumbers')).sort((a, b) => a - b);
  const foodItems = JSON.parse(localStorage.getItem('cart'));
  const selectedTime = localStorage.getItem('selectedTime');
  const navigate = useNavigate();
  const goToPaymentPage = () => {
    navigate('/payment');
  };
  const country = localStorage.getItem('country');
  // Check if the retrieved items are valid and calculate the total cost
  const moviePrice = selectedMovie.price;
  const validSeatNumbers = Array.isArray(seatNumbers) ? seatNumbers : [];
  const validFoodItems = Array.isArray(foodItems) ? foodItems : [];

  let moviePriceStr;
  if (String(moviePrice).match(/\$|INR/)) {
    moviePriceStr = String(moviePrice).replace(/\$|INR/g, '');
  } else {
    moviePriceStr = moviePrice;
  }

  let moviePriceNum = parseFloat(moviePriceStr);

  const calculateTotalCost = () => {
    let calculatedTotalCost = moviePriceNum * totalSeats +
      validFoodItems.reduce((total, item) => {
        let itemPriceStr;
        if (String(item.price).match(/\$|INR/)) {
          itemPriceStr = String(item.price).replace(/\$|INR/g, '');
        } else {
          itemPriceStr = item.price;
        }

        let itemPriceNum = parseFloat(itemPriceStr || '0');
        return total + (itemPriceNum * parseInt(item.quantity || '0'));
      }, 0);
    console.log(discountPercentage, "here")
    // Apply the discount if there is any
    if (discountPercentage > 0) {
      calculatedTotalCost *= (1 - (discountPercentage / 100));
    }

    setUpdatedTotalCost(calculatedTotalCost); // Update the state with the new total cost
    let displayPrice = country === 'India' ? `${isNaN(calculatedTotalCost) ? '0.00' : calculatedTotalCost.toFixed(2)} INR` : `$${isNaN(calculatedTotalCost) ? '0.00' : calculatedTotalCost.toFixed(2)}`;
    localStorage.setItem('totalCost', calculatedTotalCost);
    setDisplayPrice(displayPrice); // Update the display price state
  };

  // Call calculateTotalCost whenever there's a change in the relevant states
  useEffect(() => {
    calculateTotalCost();
  }, [moviePriceNum, totalSeats, validFoodItems, discountPercentage, country]);


  const fetchPromoDetails = async (code) => {
    try {
      const response = await fetch(`https://booking-services-aldoub.onrender.com/findPromo?code=${code}`);
      const data = await response.json();
      if (data.promo && data.promo.code === code) {
        setDiscount(data.promo.discount);
        setDiscountPercentage(data.promo.discount);
        setPromoApplied(true);
        NotificationManager.success('Promo code applied successfully.');
      } else {
        NotificationManager.error('Invalid promo code.');
      }
    } catch (error) {
      console.error('Error fetching promo details:', error);
      NotificationManager.error('Error fetching promo details. Please try again.');
    }
  };


  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to apply promo code
  const applyPromoCode = () => {
    if (!promoApplied) {
      fetchPromoDetails(promoCode);
    } else {
      NotificationManager.warning('Promo code already applied.');
    }
  };



  // Calculate the total cost with discount
  useEffect(() => {
    // Use updatedTotalCost instead of totalCost

    const newTotalCost = updatedTotalCost - (updatedTotalCost * (discount / 100));

    localStorage.setItem('totalCost', newTotalCost);
    let displayPriceWithDiscount = country === 'India' ? `${isNaN(newTotalCost) ? '0.00' : newTotalCost.toFixed(2)} INR` : `$${isNaN(newTotalCost) ? '0.00' : newTotalCost.toFixed(2)}`;

    setDisplayPrice(displayPriceWithDiscount); // Update the display price state
  }, [discount, updatedTotalCost, country]);


  return (
    <div className="container">
      <NotificationContainer />
      <div className="card-container">
        {/* Movie Information Card */}
        <div className="card movie-card">
          <img className="card-img-top" src={selectedMovie.poster} alt="Movie poster" />
          <div className="card-body">
            <h5 className="card-title">{selectedMovie.title}</h5>
            <p className="card-text">Time: {selectedTime}</p> {/* Added line */}
            <p className="card-text">Seats: {validSeatNumbers.join(', ')}</p>
          </div>
        </div>

        {/* Food Items Card */}
        <div className="card food-card">
          <div className="card-body">
            <h5 className="card-title">Food Items</h5>
            {validFoodItems.map((item, index) => (
              <p key={index} className="card-text">
                {item.name} - Quantity: {item.quantity}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Code Input */}
      <div className="promo-code" style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="promoCode">PROMO CODE:</label>
        <input
          type="text"
          id="promoCode"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{ marginRight: '10px' }} // Add some space between the input and the button
        />
        <button onClick={applyPromoCode} style={{ marginTop: '-10px' }}>Apply</button>
      </div>



      {/* Total Cost */}
      <div className="total-cost">
        <h5>Total Cost: {displayPrice}</h5>
      </div>
      <button onClick={goToPaymentPage}>Go to Payment Page</button>
    </div>
  );
};

export default CartItems;
