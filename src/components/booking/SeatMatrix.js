import React from "react";
import Seat from './Seat';
import '../../css/Seat.css';

const GenerateSeats = (seatNumbers, occupiedSeats) => {
  return (
    <div className="row">
      {seatNumbers.map((seatNumber) => {
        return <Seat seatno={seatNumber} key={seatNumber} occupiedSeats={occupiedSeats}/>
      })}
    </div>
  )
}

const SeatMatrix = ({ occupiedSeats }) => {
  return (
    <div className="movie-complex">
      <p>Screen This way!</p>
      <div className="movie-layout">
        <div className="movie-column movie-column-left">
          {GenerateSeats([1,2,3,4],occupiedSeats)}
          {GenerateSeats([5,6,7,8],occupiedSeats)}
        </div>
        <div className="movie-column movie-column-middle">
          {GenerateSeats([13, 14, 15, 16, 17],occupiedSeats)}
          {GenerateSeats([18, 19, 20, 21, 22],occupiedSeats)}
          {GenerateSeats([23, 24, 25, 26, 27],occupiedSeats)}
          {GenerateSeats([28, 29, 30, 31, 32],occupiedSeats)}
        </div>
        <div className="movie-column movie-column-right">
          {GenerateSeats([33,34,35,36],occupiedSeats)}
          {GenerateSeats([37,38,39,40],occupiedSeats)}
        </div>
      </div>
    </div>
  )
}

export default SeatMatrix;
