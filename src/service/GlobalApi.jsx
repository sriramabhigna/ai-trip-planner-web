


export const getLocationData = async (location) => {
  try {
    const response = await fetch(`/api/locations?query=${encodeURIComponent(location)}`);
    
    // First check if response is HTML
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const text = await response.text();
      throw new Error(`Server returned HTML instead of JSON. Response: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getLocationData:', error);
    throw error;
  }
};