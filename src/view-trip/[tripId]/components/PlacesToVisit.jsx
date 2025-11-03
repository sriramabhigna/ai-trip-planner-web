/*import React from 'react'

function PlacesToVisit(trip) {
  return (
    <div> 
        <h2 className='font-bold text-lg'> 
            Places to Visit

        </h2>  
        <div>
            {trip.tripData?.itinerary.map((item,index)=>( 
                <div>
                    <h2 className='font-bold text-lg'>
                        {item.day}
                    </h2> 
                    {item.places.map((places,index)=>( 
                        <div>  
                            <h2>{places.name}</h2>

                        </div>

                    ))}
                </div>

            ))}
        </div>

      
    </div>
  )
}

export default PlacesToVisit;*/
/*import React, { useEffect, useState } from 'react';

function PlacesToVisit({ trip }) {
  const [imageMap, setImageMap] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImageMap = {};

      for (const item of trip.tripData?.itinerary || []) {
        for (const place of item.places) {
          const query = place.name;
          try {
            const res = await fetch(`http://localhost:5000/api/generate-image?prompt=${encodeURIComponent(query)}`);
            const data = await res.json();
            newImageMap[place.name] = data.imageUrl;
          } catch (err) {
            console.error(`Failed to fetch image for ${place.name}`, err);
          }
        }
      }

      setImageMap(newImageMap);
    };

    fetchImages();
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-lg mb-2'>Places to Visit</h2>
      <div>
        {trip.tripData?.itinerary.map((item, index) => (
          <div key={index} className="mb-4">
            <h3 className='font-semibold text-md mb-1'>{item.day}</h3>
            {item.places.map((place, idx) => (
              <div key={idx} className="mb-3 p-2 border rounded shadow">
                <h4 className="text-base font-medium">{place.name}</h4>
                {imageMap[place.name] && (
                  <img
                    src={imageMap[place.name]}
                    alt={place.name}
                    className="mt-2 rounded-lg w-full max-w-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;*/ 
/*import React, { useEffect, useState } from 'react';

function PlacesToVisit({ trip }) {
  const [placeInfoMap, setPlaceInfoMap] = useState({});

  useEffect(() => {
    const fetchPlaceInfo = async () => {
      const newPlaceInfoMap = {};

      for (const item of trip.tripData?.itinerary || []) {
        for (const place of item.places) {
          const query = place.name;

          try {
            // Fetch image
            const imageRes = await fetch(`http://localhost:5000/api/generate-image?prompt=${encodeURIComponent(query)}`);
            const imageData = await imageRes.json();

            // Fake description and distance for demo (you can fetch from Wikipedia/Map APIs)
            const fakeDescription = `Explore the beauty and history of ${query}, a must-visit destination offering unforgettable experiences.`;
            const fakeDistance = `${Math.floor(Math.random() * 30) + 1} km from city center`;

            newPlaceInfoMap[place.name] = {
              imageUrl: imageData.imageUrl,
              description: fakeDescription,
              distance: fakeDistance,
              mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
            };
          } catch (err) {
            console.error(`Failed to fetch info for ${query}`, err);
          }
        }
      }

      setPlaceInfoMap(newPlaceInfoMap);
    };

    fetchPlaceInfo();
  }, [trip]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">🌍 Places to Visit</h2>

      {trip.tripData?.itinerary.map((item, index) => (
        <div key={index}>
          <h3 className="text-xl font-semibold text-blue-500 mb-2">{item.day}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {item.places.map((place, idx) => {
              const info = placeInfoMap[place.name];
              return (
                <div
                  key={idx}
                  className="border p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    📍 {place.name}
                  </h4>
                  {info?.imageUrl && (
                    <img
                      src={info.imageUrl}
                      alt={place.name}
                      className="rounded-lg mt-2 mb-3 w-full h-48 object-cover"
                    />
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    📝 {info?.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📏 Distance: {info?.distance}
                  </p>
                  <a
                    href={info?.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    🗺️ View on Google Maps
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;*/ 
/*import React from 'react';

function PlacesToVisit({ trip }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">🌍 Places to Visit</h2>

      {trip.tripData?.itinerary.map((item, index) => (
        <div key={index}>
          <h3 className="text-xl font-semibold text-blue-500 mb-3">{item.day}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.places.map((place, idx) => (
              <div
                key={idx}
                className="border border-gray-300 dark:border-gray-700 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800"
              >
                <img
                  // src={place.imageUrl} 
                  src={'./ai.jpg'}
                  alt={place.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  📍 {place.name}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  🏛️ <span className="font-medium">Type:</span> {place.details}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  🕒 <span className="font-medium">Best Time:</span> {place.bestTimeToVisit}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  🎟️ <span className="font-medium">Ticket:</span> {place.ticketPrice}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  🚗 <span className="font-medium">Travel Time:</span> {place.travelTime}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  🌐 <span className="font-medium">Coordinates:</span> {place.coordinates.lat}, {place.coordinates.lng}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  🗺️ View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;*/ 


/*import React from 'react';

function PlacesToVisit({ trip }) {
  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        🌍 Must-Visit Destinations
      </h2>

      {trip.tripData?.itinerary.map((item, index) => (
        <div key={index} className="space-y-6">
          <h3 className="text-2xl font-semibold text-purple-600 mb-4 border-b pb-2">
            {item.day}
          </h3>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {item.places.map((place, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={'./ai.jpg'}
                  alt={place.name}
                  className="w-full h-48 object-cover rounded-xl mb-4 shadow"
                />

                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  📍 {place.name}
                </h4>

                <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                  <li>🏛️ <strong>Type:</strong> {place.details}</li>
                  <li>🕒 <strong>Best Time:</strong> {place.bestTimeToVisit}</li>
                  <li>🎟️ <strong>Ticket:</strong> {place.ticketPrice}</li>
                  <li>🚗 <strong>Travel Time:</strong> {place.travelTime}</li>
                  <li>🌐 <strong>Coordinates:</strong> {place.coordinates.lat}, {place.coordinates.lng}</li>
                </ul>

                <a
                  href={`https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  🗺️ View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;*/ 
import React from "react";
import { FaMapMarkerAlt, FaClock, FaTicketAlt, FaCar, FaGlobe } from "react-icons/fa";

function PlacesToVisit({ trip }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-6 text-purple-500">🗺️ Places to Visit</h2>

      {trip.tripData?.itinerary.map((item, index) => (
        <div key={index}>
          <h3 className="text-2xl font-semibold text-purple-400 mb-4 border-b border-gray-600 pb-1">
            Day {index + 1} - {item.day}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {item.places.map((place, idx) => (
              <div
                key={idx}
                className="border border-gray-600 rounded-xl p-5 bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] hover:shadow-xl hover:border-purple-500 transition duration-300"
              >
                <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-pink-400" />
                  {place.name}
                </h4>

                <p className="text-gray-300 mb-1">
                  🏛️ <span className="font-medium">Type:</span> {place.details}
                </p>
                {place.bestTimeToVisit && (
  <p className="text-gray-300 mb-1">
    <FaClock className="inline mr-2 text-yellow-300" />
    <span className="font-medium">Best Time:</span> {place.bestTimeToVisit}
  </p>
)}

                <p className="text-gray-300 mb-1">
  <FaTicketAlt className="inline mr-2 text-red-400" />
  <span className="font-medium">Ticket:</span> {place.ticketPrice ? place.ticketPrice : 'Free'}
</p>

{place.travelTime && (
  <p className="text-gray-300 mb-1">
    <FaCar className="inline mr-2 text-green-400" />
    <span className="font-medium">Travel Time:</span> {place.travelTime}
  </p>
)}

                {/* <p className="text-gray-300 mb-2">
                  <FaGlobe className="inline mr-2 text-blue-400" />
                  <span className="font-medium">Coordinates:</span> {place.coordinates.lat}, {place.coordinates.lng}
                </p> */}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`}

                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  🔗 View on Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;




