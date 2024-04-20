import React, { useState, useEffect, useContext } from "react"
import '../../css/MoviePage.css'
import { useNavigate } from 'react-router-dom';
import MovieContext from '../booking/MovieContext';

const TimeSlot = ({ time, label, movie }) => {
  const navigate = useNavigate();
  const { setSelectedMovie } = useContext(MovieContext);
  const isPast = label === 'Past';

  const handleClick = () => {
    if (!isPast) {
      setSelectedMovie(movie);
      localStorage.removeItem('selectedMovie'); // Remove the existing item
      localStorage.setItem('selectedMovie', JSON.stringify(movie)); // Set the new item
      localStorage.removeItem('selectedTime'); // Remove the existing item
      localStorage.setItem('selectedTime', time); // Set the new item
      
      navigate('/seats');
    }
  };



  return (
    <button
      onClick={handleClick}
      disabled={isPast}
      style={{
        border: '1px solid green',
        borderRadius: '5px',
        margin: '10px',
        padding: '10px',
        backgroundColor: isPast ? 'lightgray' : 'white',
        color: isPast ? 'gray' : 'green'
      }}
    >
      <div>{time}</div>
      <div>{label}</div>
    </button>
  );
};


const MovieList = ({ selectedMovie, country }) => {
  const [movies, setMovies] = useState([]);
  const currentTime = new Date();

  const convertToINR = (priceInUSD) => {
    const moviePrice = Number(priceInUSD.replace('$', ''));
    const exchangeRate = 83.49; // Update this with the current exchange rate
    return Math.round((moviePrice * exchangeRate) / 2);
  };

  const selectedDate = localStorage.getItem('date');

  useEffect(() => {
    fetch('https://booking-services-aldoub.onrender.com/movies')
      .then(response => response.json())
      .then(data => {
        let updatedMovies = data;
        if (country === 'India') {
          updatedMovies = data.map(movie => ({
            ...movie,
            price: convertToINR(movie.price)
          }));
        }
        setMovies(updatedMovies);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [country]);

  // Normalize the current time to the start of the day for comparison
  const currentDayStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());

  return (
    <div className="movie-list" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      {movies.filter(movie => !selectedMovie || movie.title.toLowerCase().includes(selectedMovie.toLowerCase())).map((movie) => (
        <div className="movie-card" key={movie._id} style={{ flex: "0 0 calc(33.33% - 20px)", margin: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={movie.poster} alt={movie.title} className="movie-poster" />
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-price">Price: {country === 'India' ? `${movie.price} INR` : `${movie.price}`}</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {movie.timings.map((timing, index) => {
                const movieTime = new Date();
                let [hours, minutes] = timing.split(':');
                const period = minutes.slice(-2);
                minutes = minutes.slice(0, -2);
                if (period === 'PM' && hours !== '12') {
                  hours = parseInt(hours) + 12;
                } else if (period === 'AM' && hours === '12') {
                  hours = 0; // Convert 12 AM to 00 hours
                }
                movieTime.setHours(hours, parseInt(minutes), 0, 0);
  
                // Determine if the selected date is today and if the movie time is in the past
                
                const dateString = currentDayStart.toISOString().split('T')[0];
                
                const isToday = selectedDate === dateString;
                const isPastTime = isToday && movieTime < currentTime;
                
  
                // Determine the label and disabled state
                const label = isPastTime ? 'Past' : 'Available';
                const disabled = isToday ? isPastTime : false;
  
                return (
                  <TimeSlot
                    key={index}
                    time={timing}
                    label={label}
                    disabled={disabled}
                    movie={movie}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
};



const MovieSelector = ({ onUpdateMovie, date, setDate }) => {
  const [movie, setMovie] = useState("");

  const handleMovieChange = (e) => {
    setMovie(e.target.value);
    onUpdateMovie(e.target.value);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate); // Update the date state in the parent component
    localStorage.setItem('date', newDate); // Save the new date to local storage
  };

  return (
    <div className="movie-selector" style={{display: 'flex', flexDirection: 'column', alignItems: 'center',color: '#CB1110', fontSize: '20px', justifyContent: 'center',width: '1565px'}}>
      <label htmlFor="movie" className="label-font" style={{fontFamily: 'Trirong, serif'}}>Select a movie:</label>
      <input
        type="text"
        id="movie"
        name="movie"
        value={movie}
        onChange={handleMovieChange}
        className="small-input"
        placeholder="Enter a movie name"
        style={{width: '50%'}}
      />
      <label htmlFor="date" className="label-font" style={{fontFamily: 'Trirong, serif'}}>Select a date:</label>
      <input
        type="date"
        id="date"
        name="date"
        value={date} 
        className="small-input"
        onChange={handleDateChange}
        style={{width: '50%', textAlign: 'center'}}
      />
    </div>
  );
  
};


const CountryCitySelector = ({ onUpdateCountry, onUpdateCity }) => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://booking-services-aldoub.onrender.com/countries');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCountries(data);
      } else {
        console.error('Error: Expected array but received', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    fetchCountries();
  }, []);
  const fetchCities = async () => {
    try {
      const response = await fetch(`https://booking-services-aldoub.onrender.com/cities/${country}`);
      const data = await response.json();
      if (Array.isArray(data.allCities)) {
        setCities(data.allCities);
      } else {
        console.error('Error: Expected array but received', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (country) {
      fetchCities();
    }
  }, [country]);

  const handleCountryChange = (e) => {
    console.log(e);
    setCountry(e.target.value);
    setCity("");
    onUpdateCountry(e);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCitySelection = (cityName) => {
    setCity(cityName);
    onUpdateCity(cityName);
  };

  return (
    <div className="country-city-selector" style={{display: 'flex', flexDirection: 'column',color: '#CB1110', fontSize: '20px', alignItems: 'center', justifyContent: 'center', width: '1565px'}}>
      <label htmlFor="country" className="label-font">Choose a country:</label>
      <input
        type="text"
        id="country"
        name="country"
        value={country}
        onChange={handleCountryChange}
        placeholder="Enter a country name"
        list="country-list"
      />
      <datalist id="country-list">
        {countries && countries.map((c) => (
          <option value={c.name} key={c._id} />
        ))}
      </datalist>



      <label htmlFor="city" className="label-font">Choose a city:</label>
      <input
        type="text"
        id="city"
        name="city"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter a city name"
        list="city-list"
      />
      <datalist id="city-list">
        {cities.map((c) => <option value={c} key={c} />)}
      </datalist>
      <CityCircle country={country} handleCitySelection={handleCitySelection} />
    </div>
  );
};

const CityCircle = ({ country, handleCitySelection }) => {
  const [majorCities, setMajorCities] = useState([]);

  useEffect(() => {
    if (country) {
      const fetchMajorCities = async () => {
        try {
          const response = await fetch(`https://booking-services-aldoub.onrender.com/cities/${country}`);
          const data = await response.json();
          if (data.majorCities) {
            setMajorCities(data.majorCities);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchMajorCities();
    }
  }, [country]);

  return (
    <div className="city-circle">
      {majorCities && majorCities.map((c) => (
        <div
          className="city-dot"
          key={c}
          onClick={() => handleCitySelection(c)}
        >
          {c}
        </div>
      ))}
    </div>
  );
};

const TheatreSelector = ({ city, onUpdateTheatre }) => {
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [theatres, setTheatres] = useState([]);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await fetch(`https://booking-services-aldoub.onrender.com/theatres/${city}`);
        const data = await response.json();
        if (Array.isArray(data.theatres)) {
          setTheatres(data.theatres);
        } else {
          console.error('Error: Expected array but received', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (city) {
      fetchTheatres();
    }
  }, [city]);

  const handleTheatreChange = (e) => {
    setSelectedTheatre(e.target.value);
    onUpdateTheatre(e.target.value);
    localStorage.setItem('selectedTheatre',selectedTheatre)
  };

  return (
    <div className="theatre-selector" style={{display: 'flex', flexDirection: 'column', alignItems: 'center',color: '#CB1110', fontSize: '20px', justifyContent: 'center'}}>
      <label htmlFor="theatre" style={{fontFamily: 'Trirong, serif'}}>Select a theatre:</label>
      <select
        id="theatre"
        name="theatre"
        value={selectedTheatre}
        onChange={handleTheatreChange}
        style={{width: '10%'}}
      >
        <option value="" disabled>-- Select Theatre --</option>
        {theatres
          ? theatres.map((theatre) => (
            <option key={theatre} value={theatre}>
              {theatre}
            </option>
          ))
          : null}
      </select>
    </div>
  );
  
};

const MoviePage = () => {
  const [country, setCountry] = useState("");
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [city, setCity] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [date, setDate] = useState("");

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('https://booking-services-aldoub.onrender.com/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
  }, []);

  const updateMovie = (movieTitle) => {
    setSelectedMovie(movieTitle);
    const movieDetails = movies.find(movie => movie.title === movieTitle);
    setSelectedMovieDetails(movieDetails);
  };



  const updateCountry = (e) => {
    setCountry(e.target.value);
    localStorage.setItem('country', e.target.value);
  };

  const updateTheatre = (theatre) => {
    setSelectedTheatre(theatre);
    localStorage.setItem('theatre', theatre);
  };
  const updateCity = (cityName) => {
    setCity(cityName);
    localStorage.setItem('city', cityName);
  };

  return (
    <div className="movie-page">
      <h1 className="label-font">Movie Page</h1>
      <MovieContext.Provider value={{ selectedMovie, selectedMovieDetails, setSelectedMovie }}>
        <CountryCitySelector onUpdateCountry={updateCountry} onUpdateCity={updateCity} />
        <TheatreSelector city={city} onUpdateTheatre={updateTheatre} />
        <MovieSelector onUpdateMovie={updateMovie} date={date} setDate={setDate} /> 
        {<MovieList key={country} selectedMovie={selectedMovie} country={country}  />}
      </MovieContext.Provider>
    </div>
  );
};



export default MoviePage;
