/*import { searchUnsplash } from './UnsplashAPI';
import { getWikiImages } from './WikimediaAPI'; // Now correctly imported

export const getLocationImages = async (location) => {
  // Try Unsplash first
  let images = await searchUnsplash(`${location} landmark`);
  
  // Fallback to Wikimedia if no results
  if (images.length === 0) {
    images = await getWikiImages(location);
  }
  
  return images;
};*/ 
export const getLocationImages = async (location) => {
  // Try Unsplash first
  let images = await searchUnsplash(location);
  
  // If empty, try Wikimedia
  if (images.length === 0) {
    console.log("Falling back to Wikimedia...");
    images = await getWikiImages(location.split(',')[0]);
  }
  
  return images;
};