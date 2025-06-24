"use client"

import { Search } from "@mui/icons-material"
import { ShoppingBag } from "@mui/icons-material"
import { Info } from "@mui/icons-material"
import Profilepart from "../components/profilepart"
import { useState } from "react"



const page = () => {

  const [src,setSrc]=useState('/back.jpeg')
const handlechange=(name)=>{
setSrc(name)

}


  return (
     <div>
<div className="h-[500px] bg-blue-950 justify-between items-center flex flex-row">
  <div className="w-1/2 flex flex-col gap-2 justify-center  ">
  <div className=" px-4 text-blue-500 text-5xl font">30%<span className="font-bold text-6xl text-gray-100">OFF</span>  Limited Offer</div>
  <div className=" px-4 text-blue-500 text-5xl">Style that</div>
  <div className='  px-4 flex flex-row py-20 gap-3'>
    <div onClick={()=>{handlechange('/front.jpg')}}   className='h[15px] w-[15px] rounded-full border-gray-400  border-2  bg-amber-400' ></div>
    <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
    <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
    <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
    </div>
  </div>
  <div className=""><img className="h-[500px] w-[62vw]" src={src}/>

</div>
   </div>
</div>

  )
}

export default page
