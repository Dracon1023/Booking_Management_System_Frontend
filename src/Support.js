import React, { useState } from 'react'
import "./css/Support.css"
const Support = () => {
    const [searchVal, setSearchVal] = useState('');
    const [data, setData] = useState([]);
    function search() {
        if (searchVal == '') {
            return
        }
        if (searchVal.includes("@")) { // email
            fetch(`http://localhost:80/paymentInfoByEmail/${searchVal}`, {  
                method: 'GET', 
                mode: 'cors', 
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
            .catch(error => {
                console.log(error)
            })
        } else { // transaction ID
            var ID = searchVal;
            if (!searchVal.includes("TRANS-")) {
                ID = "TRANS-" + searchVal;
            }
            fetch(`http://localhost:80/paymentInfoByID/${ID}`, {  
                method: 'GET', 
                mode: 'cors', 
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setData(data)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
    const handleSearch = (event) => {
        setSearchVal(event.target.value)
    }
    return (
       <div class="outsideDiv">
            <div class="searchDiv">
                <input id="searchVal" onChange={handleSearch} placeholder="Email or Transaction ID"></input>
                <button id="submit" onClick={search}>Search</button>
                <button id="extButton" onClick={() => window.open("https://dashboard.tawk.to/#/dashboard/66104a3d1ec1082f04df477f")}>Open Chat Dashboard</button>
            </div>
            <div class="info"> 
                {data.length === 0 ? <p>No results.</p> :
                data.map(item => (
                    <div key={item._id}>
                        <p><b>Email:</b> {item.email}</p>
                        <p><b>Transaction ID:</b> {item.transactionID}</p>
                        <p><b>Name</b> {item.firstname} {item.lastname}</p>
                        {item.bookingInfo && (
                            <div>
                                <p><b>Theatre:</b> {item.bookingInfo.theatre}</p>
                                <p><b>Date/Time:</b> {item.bookingInfo.date} | {item.bookingInfo.time}</p>
                                <p><b>Movie:</b> {item.bookingInfo.movie}</p>
                                <p><b>Seats:</b> {item.bookingInfo.seats}</p>
                                <p><b>Food:</b> {item.bookingInfo.foodItems}</p>
                                <p><b>Total:</b> {item.bookingInfo.totalCost}</p>
                            </div>
                        )}
                        <hr/>
                    </div>
                ))}
            </div>
       </div>
    )
}

export default Support