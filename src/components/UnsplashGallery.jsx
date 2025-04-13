// src/components/UnsplashGallery.jsx
import React, { useEffect, useState } from 'react';
import { getLocationImages } from '../service/ImageAPI';

const UnsplashGallery = ({ location }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const results = await getLocationImages(location);
      setImages(results);
      setLoading(false);
    };
    loadImages();
  }, [location]);

  return (
    <div className="gallery">
      {/* Your gallery UI here */}
    </div>
  );
};

export default UnsplashGallery;