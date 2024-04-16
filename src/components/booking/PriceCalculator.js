import React, { useContext } from "react";
import MovieContext from "./MovieContext";

const PriceCalculator = () => {
  const { selectedMovie } = useContext(MovieContext);
  const country = localStorage.getItem('country');
  let totalPrice = 0;
  
  if (selectedMovie && selectedMovie.totalSeats ) {
    var moviePrice=0;
    if(country!='India'){
      moviePrice = Number(selectedMovie.price.replace('$', '')); 
    }
    else{
      moviePrice =selectedMovie.price
    }
    
	totalPrice = selectedMovie.totalSeats * moviePrice; 
  }

  return (
    <div>
      <p>Selected {selectedMovie ? selectedMovie.totalSeats : 0} seats and the total price is {country === 'India' ? `₹${totalPrice}` : `$${totalPrice}`}</p>
    </div>
  );

};

export default PriceCalculator;
