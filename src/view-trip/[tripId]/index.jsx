import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom'
import { toast } from 'sonner'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebasecongig'; // Ensure you have the correct Firebase configuration import
import Infosection from './components/Infosection'; 
import Hotels from './components/Hotels'; 
import PlacesToVisit from './components/PlacesToVisit'; 
import PlaceCardItem from './components/PlaceCardItem'; 
import Footer from './components/Footer'; 



function  ViewTrip() { 
    const {tripId}=useParams(); 
    const[trip,setTrip]=useState([]);  
    useEffect(()=>{ 
      tripId&&GetTripData();

    },[tripId]) 


    // used get trip information from firebase
    const GetTripData=async()=>{ 
        const docRef=doc(db,'AITrips',tripId);  
        const docSnap=await getDoc(docRef);
        if (docSnap.exists()){
          console.log("Document:",docSnap.data()); 
          setTrip(docSnap.data());
        }else{
          console.log("No Such Document"); 
          toast('No trip Found!');
        }


    }
  return (
    
    <div className='w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 py-8'>  
        {/* Information Section*/}  
        <Infosection trip={trip}/>
        {/*Recommended Hotels*/}  
        <Hotels trip={trip}/>
        {/* Daily Plan*/}  
        <PlacesToVisit trip={trip}/>
        {/* Footer*/} 
        <Footer trip={trip}/>
        
      
    </div>
  )
}

export default  ViewTrip
