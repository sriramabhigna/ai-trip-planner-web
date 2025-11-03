import React from 'react' 
import { Link } from 'react-router-dom'

function PlaceCardItem({place}) {
  return ( 
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.name} target='_blank'>
    <div> 
        <img src="/ai.jpg" 
        className='w-[100px] h-[100px] rounded-xl'></img>
      
    </div> 
    </Link>
  )
}

export default PlaceCardItem
