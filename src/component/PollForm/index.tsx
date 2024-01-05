import React from 'react'
import Carousel from '../Carousel'
import { getSlides } from "../../api/slides";
import './style.css'

const PollForm:React.FC = () => {
  
    const fetchSlides = async () => {
        const res = await getSlides();
        return res;
      };  
  return (
    <div className='container'>
        <Carousel initialSlides = {fetchSlides}/>
    </div>
  )
}

export default PollForm