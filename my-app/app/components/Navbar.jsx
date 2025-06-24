'use client'

import React from 'react'
import { Search } from "@mui/icons-material"
import { ShoppingBag } from "@mui/icons-material"
import { Info } from "@mui/icons-material"

const Navbar = () => {
  return (
   <div className="bg-amber-400 h-14 flex justify-between items-center px-2">
      
     <img src="/logo.png" className="w-[150px] h-[100px] py-2"/>
     <div className="flex flex-row justify-center items-center gap-3 text-[12px]">
     <div className=" bg-gray-800 px-4 py-1 rounded-full text-gray-200">HOME</div>
     <div className=" bg-gray-800 px-4 py-1 rounded-full text-gray-200">COLLECTIONS</div>
     <div className=" bg-gray-800 px-4 py-1 rounded-full text-gray-200">ABOUT</div>
     <div className=" bg-gray-800 px-4 py-1 rounded-full text-gray-200">CONTACT</div>
     </div>
     <div className="flex flex-row gap-4">
      <Search  sx={{  cursor: "pointer" }}/>
      <ShoppingBag  sx={{ cursor: "pointer" }}/>
      <Info sx={{  cursor: "pointer" }}/>
     </div>
    </div>
  )
}

export default Navbar
