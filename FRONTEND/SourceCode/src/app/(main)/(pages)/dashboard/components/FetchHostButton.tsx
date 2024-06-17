import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

/* ---------> [FetchHostInfoButton Component] <--------- */

/**
 * This component renders a button that fetches host information when clicked.
 * @param {string} hostId - The ID of the host to fetch information for.
 * @param {function} onFetch - Callback function to handle the fetched data.
 */
type FetchHostInfoButtonProps = {
  hostId: string;
  onFetch: (data: any) => void;
};

/**
 * Function to fetch host information from the server.
 * @param {string} hostId - The ID of the host to fetch information for.
 * @param {function} onFetch - Callback function to handle the fetched data.
 * @param {function} setLoading - Function to set the loading state.
 */
const fetchHostInfo = async (hostId: string, onFetch: (data: any) => void, setLoading: (isLoading: boolean) => void) => {
  setLoading(true); // Start loading
  try {
    const response = await fetch(`http://localhost:5000/api/host_info/${hostId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Host info:', data);
    onFetch(data); // Pass the data to the callback function
  } catch (error) {
    console.error('Error fetching host info:', error);
  } finally {
    setLoading(false); // Stop loading
  }
};

/**
 * Component rendering the button for fetching host information.
 * @param {FetchHostInfoButtonProps} props - Component props.
 * @returns {JSX.Element} The button component.
 */
const FetchHostInfoButton: React.FC<FetchHostInfoButtonProps> = ({ hostId, onFetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button onClick={() => fetchHostInfo(hostId, onFetch, setIsLoading)} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Fetch Host Info'}
    </Button>
  );
};

export default FetchHostInfoButton;
