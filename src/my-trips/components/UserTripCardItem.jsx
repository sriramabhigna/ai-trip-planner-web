/*import React from 'react'

function UserTripCardItem({trip}) { 
    const {userSelection}=trip;
  return (
    <div> 
         <img src='/ai.jpg' className="object-cover rounded-xl"/>  
        <div>
            <h2 className='font-bold text-lg'>
                {userSelection?.location}
            </h2> 
            <h2 className='text-sm text-gray-500'>{trip.userSelection.noofdays} Days trip with {trip?.userSelection?.budget} Budget</h2>
        </div>
      
    </div>
  )
}

export default UserTripCardItem*/ 
// src/my-trips/components/UserTripCardItem.jsx
// src/my-trips/components/UserTripCardItem.jsx
import React from 'react';

function UserTripCardItem({ trip }) {
  const { userSelection, itinerary, tripName } = trip;
  const places = itinerary?.day1 || [];

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between">
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-indigo-700">{tripName}</h3>
        <p className="text-sm text-gray-500">
          {userSelection?.noofdays} Day Trip &middot;<br /> 
          Budget: <span className="font-semibold">{userSelection?.budget}</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">{userSelection?.location}</p>
      </div>

      
      <div className="mb-4">
        {/* <h4 className="font-semibold text-md mb-2 text-gray-700">📍 Itinerary Highlights:</h4> */}
        <div className="space-y-2">
          {places.map((place, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:bg-gray-50 transition"
            >
              <p className="text-sm font-medium text-gray-800">{place.placeName}</p>
              <p className="text-xs text-gray-600">{place.placeDetails}</p>
              <p className="text-xs italic text-gray-400">{place.travelTime}</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="mt-auto pt-4 border-t text-xs text-gray-400">
        Traveler: <span className="text-gray-600 font-medium">{trip.userEmail}</span>
      </div>
    </div>
  );
}

export default UserTripCardItem;
