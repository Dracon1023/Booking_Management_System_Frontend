import React, { useContext, useEffect, useState } from 'react';
import MovieContext from "./MovieContext";
import '../../css/Seat.css';

const Seat = (props) => {
    const { selectedMovie, setSelectedMovie, movies } = useContext(MovieContext); // Add occupiedSeats here
    const seatNumber = props.seatno;
    const seatStatus = props.seatColor ? props.seatColor : "seat-grey";
    const [occupiedSeats,setOccupiedSeats] = useState([]);

    useEffect(() => {
        const fetchBookedSeats = async () => {
          const chosenTime = localStorage.getItem('selectedTime');
          const chosenDate = localStorage.getItem('date');
          const selectedTitle = JSON.parse(localStorage.getItem('selectedMovie')).title;
          const chosenTheatre = localStorage.getItem('theatre')
          
          try {
            const response = await fetch(`https://booking-services-aldoub.onrender.com/specificBookingInfo?title=${encodeURIComponent(selectedTitle)}&time=${encodeURIComponent(chosenTime)}&date=${encodeURIComponent(chosenDate)}&theatre=${encodeURIComponent(chosenTheatre)}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const bookedSeatsData = await response.json();
            // Assuming bookedSeatsData is an array of booking objects
            const seatsList = bookedSeatsData.flatMap(booking => booking.seats.split(', ')).flat();
            console.log(seatsList,"isha")
            setOccupiedSeats(seatsList); // Update the state with the fetched occupied seats
          } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
          }
        };
        
        fetchBookedSeats();
    }, []);


    useEffect(() => {
        if (occupiedSeats.length !== 0) {
            occupiedSeats.forEach(seat => {
                var seatElement = document.querySelector(`.seat-${seat}`);
                if (seatElement !== null) {
                    var colorsetter = seatElement.classList;
                    colorsetter.add("seat-black");
                }
            });
        }
    }, [occupiedSeats]);
    

    const seatClickHandler = (event, seatNumber) => {
        event.stopPropagation();
        const seatColor = document.querySelector(`.seat-${seatNumber}`).classList;
        if (movies.seatNumbers.includes(seatNumber)) {
            const newMovieSeats = movies.seatNumbers.filter((seat) => seat !== seatNumber);
            seatColor.remove("seat-black");
            seatColor.add("seat-grey");
            setSelectedMovie({ ...selectedMovie, totalSeats: selectedMovie.totalSeats - 1 });
            movies.seatNumbers = newMovieSeats; // Update the seatNumbers array
            localStorage.setItem('totalSeats', selectedMovie.totalSeats - 1);
            localStorage.setItem('seatNumbers', JSON.stringify(newMovieSeats));
        } else {
            seatColor.remove("seat-grey");
            seatColor.add("seat-black");
            setSelectedMovie({ ...selectedMovie, totalSeats: selectedMovie.totalSeats + 1 });
            movies.seatNumbers.push(seatNumber); // Add the new seat number to the array
            localStorage.setItem('totalSeats', selectedMovie.totalSeats + 1);
            localStorage.setItem('seatNumbers', JSON.stringify(movies.seatNumbers));
        }
    };

    return (
        <div className={`col-2 col-md-2 seat seat-${seatNumber} ${seatStatus}`}
            onClick={(e) => seatClickHandler(e, seatNumber)}>
        </div>
    );
};

export default Seat;
