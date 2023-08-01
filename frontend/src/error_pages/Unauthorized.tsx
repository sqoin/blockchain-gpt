import React from 'react';
import './Service_Unavailable.css';
import imageSrc from '../assets/images/no-passing.png';

const NotAuthorized = () => {
  return (
    <div className="error-container">
      <div className="image-container">
        <img src={imageSrc} alt="Error" className="error-image" />
      </div>
      <h1 className="error-code">401 - Server error</h1>
      <p className="error-message">Oops! Something went wrong.Try to refresh this page or<br/>feel free to contact us if the problem persists.</p>
    </div>
  );
};

export default NotAuthorized;
