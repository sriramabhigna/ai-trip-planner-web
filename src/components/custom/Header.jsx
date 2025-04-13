/*import React, { useEffect } from 'react';

import { Button } from '../ui/button'

function Header() { 
  const users=JSON.parse(localStorage.getItem('user'));
  useEffect(()=>{ 
    console.log(users)

  },[])
  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'> 
    <img src="/logo.svg" alt="AI Trip Planner Logo" />

    <div> 
      {users? 
      <div className='flex items-center gap-5'> 
        <Button variant="outline" className="rounded-full">My Trips</Button> 
        <img src={users?.picture} className='h-[35px] w-[35px] rounded-full'/>
        
      </div>: <Button>sign In</Button>}
       
    </div> 
        
      
    </div>
  )
}

export default Header*/
/*import React, { useEffect } from 'react';
import{
  Popover, 
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log("User object:", user);
  }, []);

  return (
    <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img src="/logo.svg" alt="AI Trip Planner Logo" />

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button>My Trips</button>
          
          <Popover>
            <PopoverTrigger><img
            src={user.picture}
            alt="Profile"
            style={{ height: '35px', width: '35px', borderRadius: '50%', border: '2px solid black' }}
          /> </PopoverTrigger> 
            <PopoverContent>jdvk</PopoverContent>
          </Popover>
        </div>
      ) : (
        <button>Sign In</button>
      )}
    </div>
  );
}

export default Header;*/ 
/*import React, { useEffect } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '../ui/popover'; // adjust path based on your folder structure


function Header() {
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    console.log("User object:", user);
  }, []);

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.svg" alt="AI Trip Planner Logo" />

      {user ? (
        <div className="flex items-center gap-5">
          <button className="px-4 py-2 border rounded">My Trips</button>

          <Popover>
            <PopoverTrigger asChild>
              <img
                src={user.picture}
                alt="Profile"
                className="h-[35px] w-[35px] rounded-full border border-black cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="text-sm text-gray-800">👋 Hello, {user.given_name}!</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <button className="px-4 py-2 border rounded">Sign In</button>
      )}
    </div>
  );
}

export default Header;*/ 
// import React, { useEffect } from 'react'; 
import React, { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "../ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigation } from 'react-router-dom'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // ✅ THIS ONE
import axios from 'axios';
import { toast } from 'react-toastify';





function Header() {
  // const user = JSON.parse(localStorage.getItem('user'));   
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) setUser(storedUser);
}, []);

  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    console.log("User object:", user);
  }, []); 
  const login = useGoogleLogin({
      onSuccess: (codeResp) => {
        console.log("Login Success:", codeResp);
        GetUserProfile(codeResp);
      },
      onError: (error) => console.log("Login Error:", error),
    });  
    const GetUserProfile = (tokenInfo) => {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        })
        .then((resp) => {
          console.log(resp); 
          localStorage.setItem('user', JSON.stringify(resp.data));  
          setUser(resp.data); 
          setOpenDialog(false); 
          window.location.reload();
          OnGenerateTrip();
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to fetch user profile");
        });
    };

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5">
      <img src="/logo.svg" alt="AI Trip Planner Logo" />
      {user ? (
        <div className="flex items-center gap-5">  
        <a href='/create-trip'>
        <button className="border px-4 py-2 rounded-full">+ Create Trip</button></a>
        <a href='/my-trips'>
          <button className="border px-4 py-2 rounded-full">My Trips</button></a>
          <Popover>
            <PopoverTrigger>
              <img
                src={user.picture}
                alt="Profile"
                className="h-[35px] w-[35px] rounded-full border"
              />
            </PopoverTrigger>
            <PopoverContent>
              <h2 className='cursor-pointer'onClick={()=>{
                googleLogout(); 
                localStorage.clear();  
                window.location.reload();
          
              }}>
                Logout
              </h2>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <button onClick={()=>setOpenDialog(true)}>Sign In</button>
      )} 
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button   
                onClick={login} 
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;


