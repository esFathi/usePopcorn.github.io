import React from "react";

const ErrorMessage = ({ errorMessage }) => {
  return (
    <p className='error'>
      <span>⛔</span> {errorMessage}
    </p>
  );
};

export default ErrorMessage;
