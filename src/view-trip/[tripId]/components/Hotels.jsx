/*import React from 'react'
import { Link } from 'react-router-dom'
function Hotels({trip}) {
  return (
    <div> 
        <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2> 
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'> 
            {trip.tripData?.hotels?.map((hotel,index)=>(  
              <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel.name+" ,"+hotel?.address} target='_blank'>
                <div className='hover:scale-105 transition-all cursor-pointer'> 
                    <img src='/download.jpeg' className='h-[340px] w-full object-cover rounded-xl'/>  
                    <div className='my-2 flex flex-col gap-2'>  
                      <h2 className='font-medium'>{hotel?.name}</h2> 
                      <h2 className='text-xs text-gray-500'>📍 {hotel?.address}</h2> 
                      <h2 className='text-sm'>💰 {hotel?.price}</h2> 
                      <h2 className='text-sm'>🌟 {hotel?.rating}</h2>
                    </div>

                </div> 
                </Link>


            ))}
        </div>
      
    </div>
  )
}

export default Hotels*/ 
/*import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Hotels({ trip }) {
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const hotel of trip.tripData?.hotels || []) {
        const prompt = `${hotel.name} hotel exterior view`;
        try {
          const res = await fetch(`http://localhost:3001/api/generate-image?prompt=${encodeURIComponent(prompt)}`);
          const data = await res.json();
          newImages[hotel.name] = data.imageUrl || '/download.jpeg'; // fallback
        } catch (err) {
          console.error('Image fetch error:', err);
          newImages[hotel.name] = '/download.jpeg';
        }
      }
      setImages(newImages);
    };

    fetchImages();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {trip.tripData?.hotels?.map((hotel, index) => (
          <Link key={index} to={`https://www.google.com/maps/search/?api=1&query=${hotel.name},${hotel?.address}`} target='_blank'>
            <div className='hover:scale-105 transition-all cursor-pointer'>
              <img
                src={images[hotel.name] || '/download.jpeg'}
                className='h-[340px] w-full object-cover rounded-xl'
                alt={hotel.name}
              />
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium'>{hotel?.name}</h2>
                <h2 className='text-xs text-gray-500'>📍 {hotel?.address}</h2>
                <h2 className='text-sm'>💰 {hotel?.price}</h2>
                <h2 className='text-sm'>🌟 {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;*/ 

/*
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Hotels({ trip }) {
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const hotel of trip.tripData?.hotels || []) {
        const city = hotel?.address?.split(',')[1] || 'hotel';
        const randomNum = Math.floor(Math.random() * 1000); // prevents caching
        const query = `${hotel.name} ${city} hotel`;
        const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}&sig=${randomNum}`;

        newImages[hotel.name] = url;
      }
      setImages(newImages);
    };

    fetchImages();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {trip.tripData?.hotels?.map((hotel, index) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.name},${hotel?.address}`}
            target='_blank'
          >
            <div className='hover:scale-105 transition-all cursor-pointer'>
              <img
                src={images[hotel.name]}
                onError={(e) => (e.target.src = '/ai.jpg')}
                className='h-[340px] w-full object-cover rounded-xl'
                alt={hotel.name}
              />
              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium text-blue-400'>{hotel?.name}</h2>
                <h2 className='text-xs text-pink-300'>📍 {hotel?.address}</h2>
                <h2 className='text-sm text-yellow-300'>💰 {hotel?.price}</h2>
                <h2 className='text-sm text-yellow-400'>🌟 {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;*/ 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import hotelAnim from '@/animations/hotel.json'; // adjust path if needed

function Hotels({ trip }) {
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const hotel of trip.tripData?.hotels || []) {
        const city = hotel?.address?.split(',')[1] || 'hotel';
        const randomNum = Math.floor(Math.random() * 1000);
        const query = `${hotel.name} ${city} hotel`;
        const url = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}&sig=${randomNum}`;

        newImages[hotel.name] = url;
      }
      setImages(newImages);
    };

    fetchImages();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {trip.tripData?.hotels?.map((hotel, index) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.name},${hotel?.address}`}
            target='_blank'
          >
            <div className='hover:scale-105 transition-all cursor-pointer'>
              {images[hotel.name] ? (
                <img
                  src={images[hotel.name]}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const fallback = document.getElementById(`lottie-${index}`);
                    if (fallback) fallback.style.display = 'block';
                  }}
                  className='h-[240px] w-full object-cover rounded-xl'
                  alt={hotel.name}
                />
              ) : (
                <div className="h-[240px]">
                  <Lottie animationData={hotelAnim} loop={true} className="h-[240px]" />
                </div>
              )}

              <div id={`lottie-${index}`} style={{ display: 'none' }}>
                <Lottie animationData={hotelAnim} loop={true} className="h-[240px]" />
              </div>

              <div className='my-2 flex flex-col gap-2'>
                <h2 className='font-medium text-blue-400'>{hotel?.name}</h2>
                <h2 className='text-xs text-pink-300'>📍 {hotel?.address}</h2>
                <h2 className='text-sm text-yellow-300'>💰 {hotel?.price}</h2>
                <h2 className='text-sm text-yellow-400'>🌟 {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;

