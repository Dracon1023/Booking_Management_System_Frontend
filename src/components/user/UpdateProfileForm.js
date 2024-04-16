import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./../../css/UpdateUserProfile.css";

const UpdateProfileForm = ({ initialData, onSave, email }) => {
  const navigate = useNavigate();
  const deployed = 'https://booking-services-aldoub.onrender.com/users/me/update';
  const deployed_intial = 'https://booking-services-aldoub.onrender.com/users/me';
  const local = 'http://localhost:80/users/me/update';
  const local_inital = 'http://localhost:80/users/me';
  // Initialize formData with interests as an empty array
  const [formData, setFormData] = useState({
    basicInfo: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      city: "",
      state: "",
      country: "",
      dob: "",
    },
    interests: [],
    favoriteGenre: "",
    paymentDetails: [],
    profileImage: "",
    rewardPoints: 0,
    membershipStatus: "none",
    promotionalOffers: [],
  });
  const [mobileNumberError, setMobileNumberError] = useState("");
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found in session storage");
        }

        const response = await fetch(deployed_intial, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Check if userData has the expected structure
        if (!userData || !userData.basicInfo) {
          throw new Error("Invalid user data structure");
        }

        // Ensure rewardPoints is present or set to 0 if missing
        const updatedUserData = {
          ...userData,
          rewardPoints: userData.rewardPoints || 0,
        };

        if (!updatedUserData.membershipStatus) {
          updatedUserData.membershipStatus = "none";
        }

        // Update formData with fetched data
        setFormData(updatedUserData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "basicInfo.mobileNumber") {
      // Validate mobile number format
      const isValid = /^\d{3}-\d{3}-\d{4}$/.test(value);
      setMobileNumberError(
        isValid ? "" : "Mobile number should be in format XXX-XXX-XXXX"
      );
    }
    if (type === "checkbox") {
      // If it's a checkbox, handle multiple selections
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((item) => item !== value),
      }));
    } else if (name.startsWith("paymentDetails")) {
      // Handle updating payment details
      const [field, index, subField] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        paymentDetails: prevData.paymentDetails.map((card, i) =>
          i == index ? { ...card, [subField]: value } : card
        ),
      }));
    } else if (name.startsWith("basicInfo")) {
      // Handle updating basicInfo
      const [field, subField] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        basicInfo: {
          ...prevData.basicInfo,
          [subField]: value,
        },
      }));
    } else {
      // For other input types, update the value as usual
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle file input change for updating the profile image
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert the image file to a base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCard = () => {
    setFormData((prevData) => ({
      ...prevData,
      paymentDetails: [...prevData.paymentDetails, {}],
    }));
  };

  const removeCard = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      paymentDetails: prevData.paymentDetails.filter((card, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mobileNumberError) {
      console.error("Mobile number is invalid");
      return;
    }

    try {
      // Fetch the token from session storage
      const token = sessionStorage.getItem("token");

      // Check if the token is available
      if (!token) {
        console.error("Token not found in session storage");
        return;
      }

      // Make API request to backend with the token in the headers
      const response = await fetch(deployed, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        // Profile Update successful
        navigate("/me");
      } else {
        // Profile update failed
        console.log("Update failed:", data.error);
      }
    } catch (error) {
      console.error("Error during updating:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="email" value={email} />{" "}
      {/* Hidden email input */}
      <label className="photo">
        Profile Picture:
        <input
          type="file"
          accept="image/*"
          name="profileImage"
          onChange={handleImageChange}
        />
        {formData.profileImage && (
          <img
            src={formData.profileImage}
            alt="Profile"
            className="profile-preview"
          />
        )}
      </label>
      <label>
        First Name:
        <input
          type="text"
          name="basicInfo.firstName"
          value={formData.basicInfo.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="basicInfo.lastName"
          value={formData.basicInfo.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Mobile Number:
        <input
          type="text"
          name="basicInfo.mobileNumber"
          value={formData.basicInfo.mobileNumber}
          onChange={handleChange}
        />
        {mobileNumberError && (
          <span className="error">{mobileNumberError}</span>
        )}
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          name="basicInfo.dob"
          value={formData.basicInfo.dob}
          onChange={handleChange}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="basicInfo.city"
          value={formData.basicInfo.city}
          onChange={handleChange}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          name="basicInfo.state"
          value={formData.basicInfo.state}
          onChange={handleChange}
        />
      </label>
      <label>
        Country:
        <input
          type="text"
          name="basicInfo.country"
          value={formData.basicInfo.country}
          onChange={handleChange}
        />
      </label>
      <label>
        Card Information:
        {formData.paymentDetails.map((card, index) => (
          <div key={index} className="card-info">
            <label>
              Card Number:
              <input
                type="text"
                name={`paymentDetails.${index}.cardNumber`}
                value={card.cardNumber || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name={`paymentDetails.${index}.expiryDate`}
                value={card.expiryDate || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name={`paymentDetails.${index}.cvv`}
                value={card.cvv || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              ZIP:
              <input
                type="text"
                name={`paymentDetails.${index}.zip`}
                value={card.zip || ""}
                onChange={handleChange}
              />
            </label>
            <button
              type="button"
              className="remove"
              onClick={() => removeCard(index)}
            >
              Remove Card
            </button>
          </div>
        ))}
        <button type="button" className="add" onClick={addCard}>
          Add Card
        </button>
      </label>
      <label>What are your interests?</label>
      <div className="interests">
  <div>
    <label>
    <input
      type="checkbox"
      id="action"
      name="interests"
      value="action"
      checked={formData.interests.includes("action")}
      onChange={handleChange}
    />
     Action
    </label>
  </div>
  <div>
    <input
      type="checkbox"
      id="comedy"
      name="interests"
      value="comedy"
      checked={formData.interests.includes("comedy")}
      onChange={handleChange}
    />
    <span htmlFor="comedy">Comedy</span>
  </div>
  <div>
    <input
      type="checkbox"
      id="drama"
      name="interests"
      value="drama"
      checked={formData.interests.includes("drama")}
      onChange={handleChange}
    />
    <span htmlFor="drama">Drama</span>
  </div>
  <div>
    <input
      type="checkbox"
      id="historical-fiction"
      name="interests"
      value="historical fiction"
      checked={formData.interests.includes("historical fiction")}
      onChange={handleChange}
    />
    <span htmlFor="historical-fiction">Historical Fiction</span>
  </div>
  <div>
    <input
      type="checkbox"
      id="fantasy"
      name="interests"
      value="fantasy"
      checked={formData.interests.includes("fantasy")}
      onChange={handleChange}
    />
    <span htmlFor="fantasy">Fantasy</span>
  </div>
  <div>
    <input
      type="checkbox"
      id="tragedy"
      name="interests"
      value="tragedy"
      checked={formData.interests.includes("tragedy")}
      onChange={handleChange}
    />
    <span htmlFor="tragedy">Tragedy</span>
  </div>
</div>
<label>What is your favorite genre?</label>
<div className="favorite-genre">
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="action"
      checked={formData.favoriteGenre === "action"}
      onChange={handleChange}
    />
    <span>Action</span>
  </div>
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="comedy"
      checked={formData.favoriteGenre === "comedy"}
      onChange={handleChange}
    />
    <span>Comedy</span>
  </div>
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="drama"
      checked={formData.favoriteGenre === "drama"}
      onChange={handleChange}
    />
    <span>Drama</span>
  </div>
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="historical fiction"
      checked={formData.favoriteGenre === "historical fiction"}
      onChange={handleChange}
    />
    <span>Historical Fiction</span>
  </div>
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="fantasy"
      checked={formData.favoriteGenre === "fantasy"}
      onChange={handleChange}
    />
    <span>Fantasy</span>
  </div>
  <div>
    <input
      type="radio"
      name="favoriteGenre"
      value="tragedy"
      checked={formData.favoriteGenre === "tragedy"}
      onChange={handleChange}
    />
    <span>Tragedy</span>
  </div>
</div>
      <button type="submit" className="save">
        Save Changes
      </button>
    </form>
  );
};

export default UpdateProfileForm;
