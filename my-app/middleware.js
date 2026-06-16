// import { clerkMiddleware } from '@clerk/nextjs/server';

import { NextResponse } from "next/server";

// export default clerkMiddleware({
//   publicRoutes: ['/api/webhook'], // ✅ same public route
// });

// export const config = {
//   matcher: [
//     '/((?!_next|.*\\..*).*)',  // ✅ functionally the same matcher
//     '/',
//     '/(api|trpc)(.*)',
//   ],
// };
// export const config = {
//   matcher: [],
// };

// export default function middleware() {
//   // No authentication, no Clerk – completely empty
//   return;
// }


export function middleware(req){

const visited=req.cookies.get("visited")

const url=req.nextUrl.pathname;

if(!visited&&url==="/"){

  const res=NextResponse.redirect(new URL("/sign-up",req.url))

  res.cookies.set("visited","true",{path:"/",maxAge:60*60*24*365})

  return res;


}

return NextResponse.next()

}