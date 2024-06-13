// components/ScanButton.js
import React from 'react';

const ScanButton = ({ isLoading, onClick }) => (
  <button onClick={onClick} disabled={isLoading}>
    {isLoading ? 'Scanning Network...' : 'Scan Network'}
  </button>
);

export default ScanButton;
