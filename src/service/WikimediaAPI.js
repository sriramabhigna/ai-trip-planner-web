export const getWikiImages = async (query) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=images&format=json&origin=*`
      );
      const data = await response.json();
      
      // Extract image titles from the response
      const page = Object.values(data.query.pages)[0];
      const images = page?.images?.slice(0, 5) || [];
      
      // Convert to direct image URLs
      return images.map(img => ({
        title: img.title,
        url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(img.title)}`
      }));
    } catch (error) {
      console.error('Wikimedia API error:', error);
      return [];
    }
  };