/*import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SelectBudgetOptions } from "../constants/options";
import { SelectTravelesList } from "../constants/options";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google"; 
import { getFirestore } from "firebase/firestore";

import { doc, setDoc } from "firebase/firestore";  
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import {db} from "../service/firebasecongig";
import { useNavigate } from "react-router-dom";

// Add a new document in collection "cities"
// await setDoc(doc(db, "cities", "LA"), {
//   name: "Los Angeles",
//   state: "CA",
//   country: "USA"
// });

const LOCATIONIQ_API_KEY = "pk.f4752c9bbe7822574533f3e4cf0354c4"; // Replace with your actual API key
// const AI_PROMPT =
//   "Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. Give me Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, and descriptions. Also, suggest an itinerary with placeName, Place Details, Place Image URL, Geo Coordinates, ticket Pricing, and travel time for each location for {totalDays} days, with each day's plan including the best time to visit, in JSON format."; 
const AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. 
IMPORTANT: Your response must be valid JSON format only, with no additional text or explanations.

The JSON should contain:
1. Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, and descriptions.
2. An itinerary with placeName, Place Details, Place Image URL, Geo Coordinates, ticket Pricing, and travel time for each location for {totalDays} days.
3. Each day's plan should include the best time to visit.

Example format:
{
  "hotels": [
    {
      "name": "Hotel Example",
      "address": "123 Street",
      "price": "$100",
      "imageUrl": "http://example.com/image.jpg",
      "coordinates": {"lat": 12.34, "lng": 56.78},
      "rating": 4.5,
      "description": "Luxury hotel with great views"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "name": "City Park",
          "details": "Beautiful park in the city center",
          "imageUrl": "http://example.com/park.jpg",
          "coordinates": {"lat": 12.34, "lng": 56.78},
          "ticketPrice": "$10",
          "travelTime": "30 minutes",
          "bestTimeToVisit": "Morning"
        }
      ]
    }
  ]
}`;

function CreateTrip() {
  const [openDialog, setOpenDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 20.5937, lng: 78.9629 }); // Default: India 
  const[loading,setLoading]=useState(false); 
  const navigate=useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Login Success:", codeResp);
      GetUserProfile(codeResp);
    },
    onError: (error) => console.log("Login Error:", error),
  }); 
  const SaveAiTrip=async(TripData)=>{  
    const user=JSON.parse(localStorage.getItem('user'));
    const docId=Date.now().toString() 
    
    await setDoc(doc(db, "AITrips", docId), {
      userSelection:formData,
      tripData:JSON.parse(TripData), 
      userEmail:user?.email, 
      id:docId,
    }); 
    setLoading(false); 
    navigate('/view-trip/'+docId)

  }

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
        localStorage.setItem('user',JSON.stringify(resp.data));  
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${value}&format=json`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setSelectedLocation(place.display_name);
    setCoordinates({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    handleInputChange("location", place.display_name);
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!formData?.location || !formData?.budget || !formData?.travelers || formData?.noOfDays > 5) {
      toast("Please fill all the details");
      return;
    } 
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location)
      .replace("{totalDays}", formData?.noofdays)
      .replace("{traveler}", formData?.travelers)
      .replace("{budget}", formData?.budget);

    console.log("Prompt:", FINAL_PROMPT);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chatSession = await model.startChat({
        history: [],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      });

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("AI Response:", result.response.text());  
      setLoading(false);
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip. Please try again.");
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>
      <div className="mt-10 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">What is your destination of your choice?</h2>
          <input
            type="text"
            placeholder="Enter destination..."
            className="p-2 border rounded w-full"
            value={query}
            onChange={handleSearch}
          />
          {suggestions.length > 0 && (
            <ul className="border rounded mt-2 max-h-40 overflow-auto bg-white">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectLocation(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedLocation && (
        <p className="mt-3 text-gray-600">
          <strong>Selected Destination:</strong> {selectedLocation}
        </p>
      )}
      <div className="mt-5">
        <MapContainer center={coordinates} zoom={10} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coordinates}>
            <Popup>{selectedLocation || "Selected Location"}</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">How many days are you planning for the trip?</h2>
        <input
          placeholder="Ex. 3"
          type="number"
          className="p-2 border rounded w-full"
          onChange={(e) => handleInputChange("noofdays", e.target.value)}
        />
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">What do you plan on traveling with on your next adventure?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.travelers === item.people && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 flex justify-end">
        <Button  
        disabled={loading}
        onClick={OnGenerateTrip}  >
        {loading? 
          <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />:'OnGenerateTrip'
        }
       
        </Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button   
              onClick={login} 
              className="w-full mt-5 flex gap-4 items-center">
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

export default CreateTrip;*/ 








/*import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SelectBudgetOptions, SelectTravelesList } from "../constants/options";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google"; 
import { doc, setDoc } from "firebase/firestore";  
import { db } from "../service/firebasecongig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const LOCATIONIQ_API_KEY = "pk.f4752c9bbe7822574533f3e4cf0354c4";
// const AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. 
// Give me Hotels options list with HotelName, Hotel address, Price, hotel image URL, geo coordinates, rating, and descriptions. 
// Also, suggest an itinerary with placeName, Place Details, Place Image URL, Geo Coordinates, ticket Pricing, and travel time 
// for each location for {totalDays} days, with each day's plan including the best time to visit, in JSON format.`;
const AI_PROMPT = `
Generate Travel Plan for Location: {location}, for {totalDays} Days for {traveler} with a {budget} budget. 

Give me ONLY the raw JSON response in the following structure:

{
  "hotels": [...],
  "itinerary": {
    "day1": [...],
    "day2": [...]
  }
}
Do not include any text, titles, or formatting like markdown. Only return valid JSON.
`;

function CreateTrip() {
  const [openDialog, setOpenDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 20.5937, lng: 78.9629 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.error("Login Error:", error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: "application/json",
        },
      })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => console.error("Error fetching user profile:", error));
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${value}&format=json`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setSelectedLocation(place.display_name);
    setCoordinates({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    handleInputChange("location", place.display_name);
  };

  const SaveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    try {
      const parsedData = JSON.parse(TripData); // Safely parse JSON
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsedData,
        userEmail: user?.email,
        id: docId,
      });
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("AI response is not valid JSON or saving to Firestore failed.");
    } finally {
      setLoading(false);
    }
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) return setOpenDialog(true);

    if (!formData?.location || !formData?.budget || !formData?.travelers || formData?.noofdays > 5) {
      toast("Please fill all the details");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location)
      .replace(/{totalDays}/g, formData?.noofdays)
      .replace("{traveler}", formData?.travelers)
      .replace("{budget}", formData?.budget);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(FINAL_PROMPT);
      const text = result?.response?.text();

      // Validate JSON block
      const startIndex = text.indexOf("{");
       const endIndex = text.lastIndexOf("}");
      const jsonText = text.substring(startIndex, endIndex + 1);
       SaveAiTrip(jsonText);
     } catch (error) {
      console.error("Error generating trip:", error);
       toast("Failed to generate trip. Try again.");
      setLoading(false);
     } 
     

  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary.
      </p>

      
      <div className="mt-10 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">Where are you going?</h2>
          <input
            type="text"
            placeholder="Enter destination..."
            className="p-2 border rounded w-full"
            value={query}
            onChange={handleSearch}
          />
          {suggestions.length > 0 && (
            <ul className="border rounded mt-2 max-h-40 overflow-auto bg-white">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectLocation(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      
      {selectedLocation && (
        <>
          <p className="mt-3 text-gray-600">
            <strong>Selected Destination:</strong> {selectedLocation}
          </p>
          <div className="mt-5">
            <MapContainer center={coordinates} zoom={10} style={{ height: "400px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={coordinates}>
                <Popup>{selectedLocation || "Selected Location"}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </>
      )}

      
      <div className="mt-5">
        <h2 className="text-xl my-3 font-medium">How many days?</h2>
        <input
          type="number"
          placeholder="Ex. 3"
          className="p-2 border rounded w-full"
          onChange={(e) => handleInputChange("noofdays", e.target.value)}
        />
      </div>

    
      <div>
        <h2 className="text-xl my-3 font-medium">What's your budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

    
      <div>
        <h2 className="text-xl my-3 font-medium">Who are you traveling with?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.travelers === item.people && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      
      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip} disabled={loading}>
          {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : "Generate Trip"}
        </Button>
      </div>

     
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="Logo" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in securely with Google to generate your trip</p>
              <Button onClick={login} className="w-full mt-5 flex gap-4 items-center">
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

export default CreateTrip;*/








import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SelectBudgetOptions } from "../constants/options";
import { SelectTravelesList } from "../constants/options";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google"; 
import { doc, setDoc } from "firebase/firestore";  
import { AiOutlineLoading3Quarters } from "react-icons/ai"; 
import { db } from "../service/firebasecongig";
import { useNavigate } from "react-router-dom";

const LOCATIONIQ_API_KEY = "pk.f4752c9bbe7822574533f3e4cf0354c4";

const AI_PROMPT = `Generate a detailed travel plan in JSON format ONLY. The plan should include:
1. Destination: {location}
2. Duration: {totalDays} days
3. Traveler type: {traveler}
4. Budget: {budget}

The JSON structure must include:
- "hotels": Array of hotel options with name, address, price, imageUrl, coordinates, rating, description
- "itinerary": Array of daily plans with:
  - "day": Number
  - "places": Array of places to visit with name, details, imageUrl, coordinates, ticketPrice, travelTime, bestTimeToVisit
- "summary": Brief overview of the trip
- "totalEstimatedCost": Estimated total cost

Example format:
{
  "hotels": [
    {
      "name": "Hotel Example",
      "address": "123 Street",
      "price": "$100",
      "imageUrl": "http://example.com/image.jpg",
      "coordinates": {"lat": 12.34, "lng": 56.78},
      "rating": 4.5,
      "description": "Luxury hotel with great views"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "places": [
        {
          "name": "City Park",
          "details": "Beautiful park in the city center",
          "imageUrl": "http://example.com/park.jpg",
          "coordinates": {"lat": 12.34, "lng": 56.78},
          "ticketPrice": "$10",
          "travelTime": "30 minutes",
          "bestTimeToVisit": "Morning"
        }
      ]
    }
  ],
  "summary": "A wonderful 3-day trip to Example City",
  "totalEstimatedCost": "$450"
}

IMPORTANT: Your response must be valid JSON format only, with no additional text or explanations.`;

function CreateTrip() {
  const [openDialog, setOpenDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 20.5937, lng: 78.9629 });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Login Success:", codeResp);
      GetUserProfile(codeResp);
    },
    onError: (error) => console.log("Login Error:", error),
  }); 

  const cleanAIResponse = (response) => {
    try {
      // Remove markdown code blocks if present
      if (response.startsWith('```json')) {
        response = response.replace(/```json|```/g, '').trim();
      }
      
      // Try to parse directly
      return JSON.parse(response);
    } catch (e) {
      console.error("Initial parse failed, trying to extract JSON:", e);
      
      // Try to find JSON within the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to extract JSON:", e);
          throw new Error("Could not parse the AI response as JSON");
        }
      }
      throw e;
    }
  };

  const SaveAiTrip = async (TripData) => {  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const docId = Date.now().toString();
      
      const cleanedData = cleanAIResponse(TripData);
      
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: cleanedData, 
        userEmail: user?.email, 
        id: docId,
      }); 
      
      setLoading(false); 
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      setLoading(false);
      toast.error("Failed to process the trip plan. Please try again.");
    }
  };

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
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile");
      });
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${value}&format=json`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (place) => {
    setQuery(place.display_name);
    setSuggestions([]);
    setSelectedLocation(place.display_name);
    setCoordinates({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    handleInputChange("location", place.display_name);
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    
    if (!formData?.location || !formData?.budget || !formData?.travelers || !formData?.noofdays) {
      toast.error("Please fill all the details");
      return;
    } 
    
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location)
      .replace("{totalDays}", formData?.noofdays)
      .replace("{traveler}", formData?.travelers)
      .replace("{budget}", formData?.budget);

    console.log("Prompt:", FINAL_PROMPT);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chatSession = await model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result.response.text();
      console.log("AI Response:", responseText);
      
      await SaveAiTrip(responseText);
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences 🏕🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>
      
      <div className="mt-10 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">What is your destination of your choice?</h2>
          <input
            type="text"
            placeholder="Enter destination..."
            className="p-2 border rounded w-full"
            value={query}
            onChange={handleSearch}
          />
          {suggestions.length > 0 && (
            <ul className="border rounded mt-2 max-h-40 overflow-auto bg-white">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectLocation(place)}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {selectedLocation && (
        <p className="mt-3 text-gray-600">
          <strong>Selected Destination:</strong> {selectedLocation}
        </p>
      )}
      
      <div className="mt-5">
        <MapContainer center={coordinates} zoom={10} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coordinates}>
            <Popup>{selectedLocation || "Selected Location"}</Popup>
          </Marker>
        </MapContainer>
      </div>
      
      <div>
        <h2 className="text-xl my-3 font-medium">How many days are you planning for the trip?</h2>
        <input
          placeholder="Ex. 3"
          type="number"
          min="1"
          max="30"
          className="p-2 border rounded w-full"
          onChange={(e) => handleInputChange("noofdays", e.target.value)}
        />
      </div>
      
      <div>
        <h2 className="text-xl my-3 font-medium">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl my-3 font-medium">What do you plan on traveling with on your next adventure?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("travelers", item.people)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.travelers === item.people && "shadow-lg border-black"
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      
      <div className="my-10 flex justify-end">
        <Button  
          disabled={loading}
          onClick={OnGenerateTrip}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
          ) : (
            'Generate Trip'
          )}
        </Button>
      </div>
      
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

export default CreateTrip;