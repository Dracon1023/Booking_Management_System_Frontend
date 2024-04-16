import React, { useState,useEffect } from 'react';
import '../../css/Meal.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';


const FoodItem = ({ name, image, price, cartItems, setCartItems }) => {
  const [quantity, setQuantity] = useState(0); // Set initial state to 0

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleAddToCart = () => {
    const cartItem = { name, image, price, quantity };
    setCartItems([...cartItems, cartItem]);
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
  
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
  };
  

  return (
    <div style={{ justifyContent: 'center' }}>
        <Card style={{ width: '300px', height: '350px' }}>
      <CardContent>
        <h3>{name}</h3>
        <img src={image} alt={name} />
        <div>
          <label htmlFor={`quantity-${name}`}>Quantity:</label>
          <input
            type="number"
            id={`quantity-${name}`}
            name={`quantity-${name}`}
            min="0"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <p>Price: {price}</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </CardContent>
    </Card>
    </div>
  );
};


const CartTotal = ({ cartItems }) => {
  let totalPrice = cartItems.reduce((sum, item) => {
    let price = Number(item.price.replace(/ INR|\$/, ''));
    return sum + price * Number(item.quantity);
  }, 0);
  let displayPrice = country === 'India' ? `${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)} INR` : `$${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}`;

return (
    <div>
      <h2>Cart Total: {displayPrice}</h2>
    </div>
);

};

const convertToINR = (priceInUSD) => {
  const exchangeRate = 83.49; // Update this with the current exchange rate
  return Math.round((priceInUSD * exchangeRate) / 2);
};

const country = localStorage.getItem('country');
console.log(country);

// A component to render the food ordering page
const FoodOrderingPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const handleShowCart = () => {
    navigate('/cart');
  };

  useEffect(() => {
    localStorage.removeItem('cart');

    fetch('https://booking-services-aldoub.onrender.com/foodItems')
      .then(response => response.json())
      .then(data => {
        setFoodItems(data);
        navigate('/meals');
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem'
    }}>
      {/* Use map to render a FoodItem component for each food item in the array */}
      {foodItems.map((item) => (
        <FoodItem
          key={item._id}
          name={item.name}
          image={item.image}
          price={country === 'India' ? `${convertToINR(item.price)} INR` : `$${item.price}`}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      ))}
      <CartTotal cartItems={cartItems} />
      <button style={{ position: 'fixed', bottom: '20px', right: '20px' }} onClick={handleShowCart}>Show Cart</button>
    </div>
  );
};


export default FoodOrderingPage;
