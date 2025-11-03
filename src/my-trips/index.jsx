/*import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom'; 
// import { getFirestore } from 'firebase/firestore'; 
import { collection, getDocs, query, where } from 'firebase/firestore'; 




import {db} from '@/service/firebaseCongig';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {  
    const navigate=useNavigate();   
    const [userTrips,setUserTrips]=useState([]);
    useEffect(()=>{ 
        GetUserTrips();

    },[])
    const GetUserTrips=async()=>{
        const user=JSON.parse(localStorage.getItem('user')); 
        
        if(!user){
            navigate('/'); 
            return;
        }  
        setUserTrips([]);
        const q=query(collection(db,'AITrips'),where('userEmail','==',user?.email)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data()); 
        setUserTrips(prevVal=>[...prevVal,doc.data()]);
});


    }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'> 
        <h2 className='font-bold text-3xl'>My Trips</h2> 
        <div className='grid grid-cols-2  mt-10 md:grid-cols-3 gap-5'> 
            {userTrips.map((trip,index)=>( 
                <UserTripCardItem trip={trip} />

            ))}

        </div>
      
    </div>
  )
} 
export default MyTrips*/ 
// src/my-trips/index.jsx
// src/my-trips/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/service/firebaseCongig';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    setUserTrips([]);
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserTrips((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl text-center text-indigo-800 mb-8">🧳 My AI-Planned Trips</h2>

      {userTrips.length === 0 ? (
        <p className="text-center text-gray-500">No trips yet. Create one to begin your journey!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {userTrips?.length>0?userTrips.map((trip, index) => (
            <UserTripCardItem key={index} trip={trip} />
          ))
        :[1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className='h-[300px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
        ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
