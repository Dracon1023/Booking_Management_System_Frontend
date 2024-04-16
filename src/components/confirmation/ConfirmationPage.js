import React from 'react';
import '../../css/ConfirmationPage.css';

const ConfirmationPage = () => {
  return (
    <div className="confirmation-page">
      <i className="bi bi-check2-circle confirmation-icon"></i>
      <h1>Thank you for booking with Movie Mates</h1>
      <p>Your booking has been confirmed.</p>
    </div>
  );
}

export default ConfirmationPage;
