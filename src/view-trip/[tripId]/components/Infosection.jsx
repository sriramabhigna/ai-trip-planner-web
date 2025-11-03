/*import React, { useEffect, useState } from 'react'; 
import { IoMdSend } from "react-icons/io";  
// import { GetPlaceDetails } from '@/service/GlobalApi';
import { Button } from "@/components/ui/button"; 
import { getLocationData } from '../../../service/GlobalApi';




function Infosection({trip}) {   
  useEffect(()=>{ 
    trip&&GetPlacePhoto();

  },[trip])
  const GetPlacePhoto= async()=>{  
    const data={ 
      textQuery:trip?.userSelection?.location

    }
    const result=await GetPlaceDetails(data).then(resp=>{
      console.log(resp.data)
    })

  }

  return (
    <div> 
        <img src='/ai.jpg' className='h-[340px] w-full object-cover rounded-xl'/> 
        <div className='flex justify-between items-center'> 
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl'>
                {trip?.userSelection?.location}
            </h2>  
            
            <div className='flex gap-5'> 
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-black-500 text-xs md:text-md'>📅{trip.userSelection?.noofdays} Day</h2> 
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰{trip.userSelection?.budget} Budget</h2> 
              <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🧑‍🤝‍🧑No. Of Traveler:{trip.userSelection?.travelers} </h2>

            </div>
        </div> 
        <Button ><IoMdSend /></Button>
      
        </div> 
        
    </div> 
    
  )
}

export default Infosection*/


// src/view-trip/[tripId]/components/Infosection.jsx


/*import React, { useEffect, useState } from 'react';
import { getLocationData } from '@/service/GlobalApi';

function Infosection({ trip }) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!trip?.userSelection?.location) return;
      
      setLoading(true);
      try {
        const data = await getLocationData(trip.userSelection.location);
        console.log('Location Data:', data); // Verify structure here
        setPlace(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trip]);

  if (loading) return <div>Loading location data...</div>;

  return (
    <div>
      {place ? (
        <div>
          <h2 className="text-2xl font-bold">{place.displayName}</h2>
          
          {place.photos.length > 0 ? (
            <div className="space-y-4">
              <img 
                src={place.photos[0].url} 
                className="h-[340px] w-full object-cover rounded-xl"
                alt={place.displayName}
              />
              <div className="grid grid-cols-3 gap-2">
                {place.photos.slice(1).map((photo, index) => (
                  <img
                    key={index}
                    src={photo.url}
                    className="h-32 w-full object-cover rounded"
                    alt={`${place.displayName} ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[340px] flex items-center justify-center bg-gray-100 rounded-xl">
              <p>No images available for this location</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[340px] flex items-center justify-center bg-gray-100 rounded-xl">
          <p>Location data not available</p>
        </div>
      )}
    </div>
  );
}

export default Infosection;*/ 

/*import React, { useEffect, useState } from 'react';

function Infosection({ trip }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trip?.userSelection?.location) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/api/google-images?q=${encodeURIComponent(trip.userSelection.location + ' landmark')}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch images');
        
        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [trip]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!images.length) return <div>No images found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{trip.userSelection.location}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${trip.userSelection.location} ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg"
            onError={(e) => e.target.src = '/image-error-placeholder.jpg'}
          />
        ))}
      </div>
    </div>
  );
}

// Example usage in App.js
function App() {
  const mockTrip = {
    userSelection: {
      location: 'Paris' // Change to test different locations
    }
  };

  return (
    <div className="p-4">
      <Infosection trip={mockTrip} />
    </div>
  );
}

export default App;*/
import React, { useEffect } from 'react';
import { IoMdSend } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { getLocationData } from '../../../service/GlobalApi';
import Lottie from "lottie-react";
import travelAnim from "@/animations/hotel2.json"; // make sure file exists here

function Infosection({ trip }) {
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location
    };
    try {
      const result = await getLocationData(data.textQuery);
      console.log(result);
    } catch (error) {
      console.error("Failed to fetch place details:", error);
    }
  };

  return (
    <div>
       <img
        src='/ai.jpg'
        className='h-[340px] w-full object-cover rounded-xl'
        alt="AI Trip Visual"
      />  
      

      


      <div className='flex justify-between items-center mt-5 flex-wrap'>
        {/* Trip Info Section */}
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>
            {trip?.userSelection?.location}
          </h2>
          <div className='flex gap-3 flex-wrap'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-black-500 text-xs md:text-md'>
              📅 {trip.userSelection?.noofdays} Day
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💰 {trip.userSelection?.budget} Budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🧑‍🤝‍🧑 No. Of Travelers: {trip.userSelection?.travelers}
            </h2>
          </div>
        </div>

        {/* Lottie Animation */}
        

        <Button className="mt-2 md:mt-0">
          <IoMdSend />
        </Button>
      </div>
    </div>
  );
}

export default Infosection;
