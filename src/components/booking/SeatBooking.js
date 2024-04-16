import React, {useState,useContext,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import SeatAvailability from "./SeatAvailability"
import SeatMatrix from "./SeatMatrix"
import PriceCalculator from "./PriceCalculator"


import MovieContext from './MovieContext'

const SeatBooking = () => {
	const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Retrieve the selected movie from localStorage when the component mounts
    const movieFromStorage = JSON.parse(localStorage.getItem('selectedMovie'));
    if (movieFromStorage) {
      setSelectedMovie({
        ...movieFromStorage,
        totalSeats: 0 // Initialize totalSeats
      });
    }
  }, []);
	  
	const [movies, EditMovies] = useState({
		movieNames: {
			"Bloodshot": 10,
			"The girl on the Train": 8,
			"The invisible Man": 11,
			"Onward": 12,
			"My Spy": 9
		},
		moviePrice: 10,
		totalSeats: 0,
		seatNumbers: []
	})


	const navigate = useNavigate()

	const handleButtonClick = () => {
		navigate('/meals')
	}
	const [occupiedSeats, setOccupiedSeats] = useState([]); // State to keep track of occupied seats

	useEffect(() => {
	  const fetchBookedSeats = async () => {
		const chosenTime = localStorage.getItem('selectedTime');
		const chosenDate = localStorage.getItem('date');
		const selectedTitle = JSON.parse(localStorage.getItem('selectedMovie')).title;
		
		try {
		  const response = await fetch(`https://booking-services-aldoub.onrender.com/specificBookingInfo?title=${encodeURIComponent(selectedTitle)}&time=${encodeURIComponent(chosenTime)}&date=${encodeURIComponent(chosenDate)}`);
		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }
		  const bookedSeatsData = await response.json();
		  // Assuming bookedSeatsData is an array of booking objects
		  const seatsList = bookedSeatsData.map(booking => booking.seats.split(', ')).flat();
		  setOccupiedSeats(seatsList); // Update the state with the fetched occupied seats
		} catch (error) {
		  console.error('There has been a problem with your fetch operation:', error);
		}
	  };
	  
	  fetchBookedSeats();
	}, []);

	return (
		<div className="main container" style={{ width: '600px' }}>
		  <MovieContext.Provider value={{ movies, selectedMovie, setSelectedMovie, editMovies: EditMovies }}>
		  <SeatMatrix occupiedSeats={occupiedSeats} />
			<SeatAvailability />
			<PriceCalculator />
			<button onClick={handleButtonClick}>Select meal plan</button>
		  </MovieContext.Provider>
		</div>
	  );
}

export default SeatBooking