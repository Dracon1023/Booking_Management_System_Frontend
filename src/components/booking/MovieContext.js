import { createContext } from "react"

export default createContext({
	selectedMovie: null,
  	setSelectedMovie: () => {},
	movies: {
		Bloodshot: 10,
		"The girl on the Train": 8,
		"The invisible Man": 11,
		Onward: 12,
		"My Spy": 12
	},
	editMovies: () => {}
})