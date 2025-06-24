// "use client"

// import { UserButton } from "@clerk/nextjs"
// import { Search } from "@mui/icons-material"
// import { ShoppingBag } from "@mui/icons-material"
// import { Info } from "@mui/icons-material"

// import { useState } from "react"



// const page = () => {

//   const [src,setSrc]=useState('/back.jpeg')
// const handlechange=(name)=>{
// setSrc(name)

// }


//   return (
//      <div>
//  <UserButton signOutRedirectUrl="/sign-in" />




// {/* <div className="h-[500px] bg-blue-950 justify-between items-center flex flex-row">
//   <div className="w-1/2 flex flex-col gap-2 justify-center  ">
//   <div className=" px-4 text-blue-500 text-5xl font">30%<span className="font-bold text-6xl text-gray-100">OFF</span>  Limited Offer</div>
//   <div className=" px-4 text-blue-500 text-5xl">Style that</div>
//   <div className='  px-4 flex flex-row py-20 gap-3'>
//     <div onClick={()=>{handlechange('/front.jpg')}}   className='h[15px] w-[15px] rounded-full border-gray-400  border-2  bg-amber-400' ></div>
//     <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
//     <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
//     <div className='h-[15px] w-[15px] rounded-full border-gray-400  border-2 bg-amber-400'></div>
//     </div>
//   </div>
//   <div className=""><img className="h-[500px] w-[62vw]" src={src}/>

// </div>
//    </div> */}
// </div>

//   )
// }

// export default page


"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { Search, ShoppingBag, Info } from "@mui/icons-material"
import { useState } from "react"

const Page = () => {
  const { signOut } = useClerk()
  const { user } = useUser()
  const [src, setSrc] = useState('/back.jpeg')

  const handleChange = (name) => {
    setSrc(name)
  }

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/sign-in" }) // Ensure this matches your route
  }

  return (
    <div className="p-4">
      {/* Optional: Show user info */}
      {user && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-semibold">Welcome, {user.fullName}</p>
            <p className="text-sm text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Uncomment below for your carousel section */}
      {/* <div className="h-[500px] bg-blue-950 justify-between items-center flex flex-row">
        <div className="w-1/2 flex flex-col gap-2 justify-center">
          <div className="px-4 text-blue-500 text-5xl font">
            30%<span className="font-bold text-6xl text-gray-100">OFF</span> Limited Offer
          </div>
          <div className="px-4 text-blue-500 text-5xl">Style that</div>
          <div className="px-4 flex flex-row py-20 gap-3">
            <div onClick={() => handleChange('/front.jpg')} className="h-[15px] w-[15px] rounded-full border-gray-400 border-2 bg-amber-400 cursor-pointer"></div>
            <div className="h-[15px] w-[15px] rounded-full border-gray-400 border-2 bg-amber-400"></div>
            <div className="h-[15px] w-[15px] rounded-full border-gray-400 border-2 bg-amber-400"></div>
            <div className="h-[15px] w-[15px] rounded-full border-gray-400 border-2 bg-amber-400"></div>
          </div>
        </div>
        <div><img className="h-[500px] w-[62vw]" src={src} alt="Showcase" /></div>
      </div> */}
    </div>
  )
}

export default Page
