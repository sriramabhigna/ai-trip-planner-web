export const searchUnsplash = async (query) => {
  // Simplify query (use only first part before comma)
  const simplifiedQuery = query.split(',')[0].trim(); 
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(simplifiedQuery)}+landmark&per_page=5`,
      {
        headers: {
          Authorization: 'Client-ID hUAOsQK8rqbxim7EjTtFHpw3G1Nrs8zmVG5Us824hP4', // Your key
          'Accept-Version': 'v1'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Unsplash API raw response:', data); // Debugging

    return data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular, 
      author: photo.user.name,
      source: 'unsplash'
    }));
  } catch (error) {
    console.error('Unsplash fetch failed:', error);
    return []; // Return empty array on failure
  }
};