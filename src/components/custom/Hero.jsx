/*import React from 'react'
import { Button } from '../ui/button'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9 '> 
        <h1 className='font-extrabold text-[50px] text-center mt-16  max-w-fit '>
        <span className='text-[#f56551] whitespace-nowrap'>Discover Your Next Adventure with AI:</span><span className='block'>Personalized Itineraries at Your Fingertips</span>
        </h1>  
        <p className='text-xl text-gray-500 text-center whitespace-nowrap'>Your personal trip planner and travelcurator, creating custom itinerariestailored to your interests and budget.
</p> 
<Button> Get Started.,It's Free</Button>
      
    </div>
  )
}

export default Hero*/ 
import React from 'react'
import { Button } from '../ui/button'

function Hero() {
  return (
    <div className='flex flex-col items-center px-8 max-w-5xl w-full mx-auto gap-9 text-center'> 
        <h1 className='font-extrabold text-[50px] mt-16 leading-tight max-w-4xl'>
          <span className='text-[#f56551] whitespace-nowrap'>Discover Your Next Adventure with AI:</span>
          <span className='block'>Personalized Itineraries at Your Fingertips</span>
        </h1>  
        <p className='text-xl text-gray-500 max-w-3xl'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p> 
        <Button className="px-6 py-3 text-lg">Get Started, It's Free</Button>
    </div>
  )
}

export default Hero
