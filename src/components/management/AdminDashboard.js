import React, { useState, useEffect } from "react";
import "./../../css/Admin.css";

const AdminDashboard = () => {
  const [offerDetails, setOfferDetails] = useState({
    discount: "",
    code: "",
    item: "",
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://booking-services-aldoub.onrender.com/bookingInfo");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBooking = async (booking) => {
    setSelectedBooking(booking);
    setIsEditing(true);
  };

  const handleUpdateBooking = async (updatedBooking) => {
    try {
      // Create a copy of the updatedBooking object without the _id
      const { _id, ...bookingWithoutId } = updatedBooking;

      const response = await fetch(
        `https://booking-services-aldoub.onrender.com/bookingInfo/${updatedBooking._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingWithoutId), // Send the copy without the _id
        }
      );
      if (response.ok) {
        alert("Booking updated successfully!");
        fetchBookings(); // Refresh bookings after update
        setIsEditing(false);
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again later.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await fetch(
          `https://booking-services-aldoub.onrender.com/bookingInfo/${bookingId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Booking deleted successfully!");
          fetchBookings(); // Refresh bookings after delete
        } else {
          throw new Error("Failed to delete booking");
        }
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again later.");
      }
    }
  };

  const displayBookings = () => {
    return bookings.map((booking, index) => (
      <li key={index}>
        <strong>Booking #{index + 1}:</strong>
        <br />
        <strong>User:</strong>{" "}
        {booking.email },<br />
        <strong>Movie:</strong> {booking.movie},<br />
        <strong>Time:</strong> {booking.time},<br />
        <strong>Date:</strong> {booking.date},<br />
        <strong>Theatre:</strong> {booking.theatre},<br />
        <strong>Seats:</strong> {booking.seats},<br />
        <strong>Food Items:</strong> {booking.foodItems},<br />
        <strong>Total Cost:</strong> {booking.totalCost}
        <br />
        {/* Edit and Delete buttons */}
        <button onClick={() => handleEditBooking(booking)}>Edit</button>
        <button onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
      </li>
    ));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setSelectedBooking((prevBooking) => ({
      ...prevBooking,
      [field]: value,
    }));
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://booking-services-aldoub.onrender.com/promotionalOffers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerDetails),
      });
      if (response.ok) {
        alert("Promotional offer created successfully!");
      } else {
        throw new Error("Failed to create promotional offer");
      }
    } catch (error) {
      console.error("Error creating promotional offer:", error);
      alert("Failed to create promotional offer. Please try again later.");
    }
  };
  const MongoDBChartIframe1 = () => {
    return (
      <div className="MongoDBChartIframe">
        <iframe
          width="100%"
          height="100%"
          src="https://charts.mongodb.com/charts-project-0-jfube/embed/charts?id=660d85b7-2972-4a19-8839-d73115888ae0&maxDataAge=3600&theme=light&autoRefresh=true"
          onLoad={() => console.log("iframe loaded")}
          onError={(e) => console.error("iframe error:", e)}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  const MongoDBChartIframe2 = () => {
    return (
      <div className="MongoDBChartIframe">
        <iframe
          width="100%"
          height="100%"
          src="https://charts.mongodb.com/charts-project-0-jfube/embed/charts?id=661ff8a9-f919-44ba-874a-bd63ce39a2b6&maxDataAge=3600&theme=light&autoRefresh=true"
          onLoad={() => console.log("iframe loaded")}
          onError={(e) => console.error("iframe error:", e)}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  const MongoDBChartIframe3 = () => {
    return (
      <div className="MongoDBChartIframe">
        <iframe
          width="100%"
          height="100%"
          src="https://charts.mongodb.com/charts-project-0-jfube/embed/charts?id=6622f737-5bbc-4bea-8937-c934d4292702&maxDataAge=3600&theme=light&autoRefresh=true"
          onLoad={() => console.log("iframe loaded")}
          onError={(e) => console.error("iframe error:", e)}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  };
  const MongoDBChartIframe4 = () => {
    return (
      <div className="MongoDBChartIframe">
        <iframe
          width="100%"
          height="100%"
          src="https://charts.mongodb.com/charts-project-0-jfube/embed/charts?id=6622f782-2e0d-4610-85e8-a95acfe29acc&maxDataAge=300&theme=light&autoRefresh=true"
          onLoad={() => console.log("iframe loaded")}
          onError={(e) => console.error("iframe error:", e)}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const handleSendNotification = async () => {
    try {
      const notificationMessage =
        "We just released a new promotional offer! Feel free to check it out.";
      const response = await fetch("https://booking-services-aldoub.onrender.com/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notificationMessage }),
      });
      if (response.ok) {
        alert("Notification sent successfully!");
      } else {
        throw new Error("Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification. Please try again later.");
    }
  };

  return (
    <main>
      <div className="admin-dashboard-container">
        <h1>Welcome to Admin Dashboard</h1>
        <div className="top-section">
        <div className="graph-section">
            <MongoDBChartIframe1 />
            <MongoDBChartIframe2 />
          </div>
          <div className="promotional-offer-section">
            <h2>Create Promotional Offer</h2>
            <form onSubmit={handleSubmitOffer}>
              <label>
                Code:
                <input
                  type="text"
                  name="code"
                  value={offerDetails.code}
                  onChange={handleChange}
                />
              </label>
              <label>
                Item:
                <select
                  name="item"
                  value={offerDetails.item}
                  onChange={handleChange}
                >
                  <option value="">Select an item</option>
                  <option value="Total">Total</option>
                  <option value="2 tickets get one free">
                    2 tickets get one free
                  </option>
                  <option value="Free meal item">Free meal item</option>
                </select>
              </label>
              <br />
              {offerDetails.item === "Total" && (
                <label>
                  Total Discount Amount:
                  <input
                    type="number"
                    name="discount"
                    value={offerDetails.discount}
                    onChange={handleChange}
                  />
                </label>
              )}
              <br />
              <button type="submit">Create Offer</button>
            </form>
            <br />
            <button onClick={handleSendNotification}>
              Send Notification to Users
            </button>
          </div>
          <div className="graph-section">
            <MongoDBChartIframe3 />
            <MongoDBChartIframe4 />
          </div>
        </div>

        <div className="bottom-section">
          <div className="data-section">
            <h2>Booking Data</h2>
            <button onClick={fetchBookings}>Refresh Booking Data</button>
            {loading ? <p>Loading...</p> : <ul>{displayBookings()}</ul>}
          </div>
          
            {/* Edit Booking Form */}
            {isEditing && selectedBooking && (
              <div className="edit-section">
                <h2>Edit Booking</h2>
                <form onSubmit={() => handleUpdateBooking(selectedBooking)}>
                  <label>
                    Movie:
                    <input
                      type="text"
                      name="movie"
                      value={selectedBooking.movie}
                      onChange={(e) => handleInputChange(e, "movie")}
                    />
                  </label>
                  <label>
                    Time:
                    <input
                      type="text"
                      name="time"
                      value={selectedBooking.time}
                      onChange={(e) => handleInputChange(e, "time")}
                    />
                  </label>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={selectedBooking.date}
                      onChange={(e) => handleInputChange(e, "date")}
                    />
                  </label>
                  <label>
                    Theatre:
                    <input
                      type="text"
                      name="theatre"
                      value={selectedBooking.theatre}
                      onChange={(e) => handleInputChange(e, "theatre")}
                    />
                  </label>
                  <label>
                    Seats:
                    <input
                      type="text"
                      name="seats"
                      value={selectedBooking.seats}
                      onChange={(e) => handleInputChange(e, "seats")}
                    />
                  </label>
                  <label>
                    Food Items:
                    <input
                      type="text"
                      name="foodItems"
                      value={selectedBooking.foodItems}
                      onChange={(e) => handleInputChange(e, "foodItems")}
                    />
                  </label>
                  <label>
                    Total Cost:
                    <input
                      type="text"
                      name="totalCost"
                      value={selectedBooking.totalCost}
                      onChange={(e) => handleInputChange(e, "totalCost")}
                    />
                  </label>
                  <button type="submit">Update Booking</button>
                </form>
              </div>
            )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
