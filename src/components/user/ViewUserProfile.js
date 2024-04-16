import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../css/ViewUserProfile.css";

const UserProfileView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(""); // State to store the token
  const deployed = 'https://booking-services-aldoub.onrender.com/users/me';
  const local = 'http://localhost:80/users/me';
  useEffect(() => {
    // Fetch user data and token from Node API
    const fetchUserData = async () => {
      try {
        // Send request to get user data and token from /users/me
        const response = await fetch(deployed, {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          // Extract the token from the response headers
          const tokenFromResponse = response.headers.get("Authorization");
          if (tokenFromResponse) {
            setToken(tokenFromResponse);
          }

          // Extract the user data from the response body
          const userDataFromResponse = await response.json();
          setUserData(userDataFromResponse);
        } else {
          console.log("Error fetching user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (!userData) {
    return <div>You need to first login</div>;
  }
  return (
    <div>
      <button className="update" onClick={() => navigate("/me/update")}>
        Update Profile
      </button>

      <div className="user-profile-container">
        {userData.basicInfo ? (
          <div className="image-div">
            <img
              className="profile-image"
              src={userData.profileImage}
              alt={`${userData.basicInfo.firstName} ${userData.basicInfo.lastName}`}
            />
            <p className="Membership">
              Membership: {userData.membershipStatus}
            </p>
            <p className="Points">Reward Points: {userData.rewardPoints}</p>
            <p className="Offers">
              Promotional Offers:{" "}
              {userData.promotionalOffers
                ? userData.promotionalOffers.join(", ")
                : "none"}
            </p>
          </div>
        ) : (
          <p>Please update your profile to view your profile information.</p>
        )}
        {userData.basicInfo && (
          <container>
            <div class="rows">
              <div className="column1">
                <p className="name">
                  Name: {userData.basicInfo.firstName}{" "}
                  {userData.basicInfo.lastName}{" "}
                </p>
                <p className="address">
                  Address: {userData.basicInfo.city}, {userData.basicInfo.state}
                  , {userData.basicInfo.country}
                </p>
                <p className="Number">
                  Mobile Number: {userData.basicInfo.mobileNumber}
                </p>
              </div>
              <div className="column2">
                <p className="email">Email: {userData.login.email}</p>
                <p className="dob">DOB: {userData.basicInfo.dob}</p>
                <p className="Payment">Payment Details:</p>
                <ul>
                  {userData.paymentDetails.map((payment, index) => (
                    <li key={index}>
                      Card Number: **** **** **** {payment.cardNumber.slice(-4)}
                      , Expiry Date: {payment.expiryDate}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="Interests-div">
              <p className="Interests">
                Interests: {userData.interests.join(", ")}
              </p>
              <p className="Genre">Favorite Genre: {userData.favoriteGenre}</p>
            </div>
            <button className="update" onClick={() => navigate("/me/update")}>
              Update Profile
            </button>
          </container>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
