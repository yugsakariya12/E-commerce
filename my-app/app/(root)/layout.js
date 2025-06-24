import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Vibe Zone",
  description: "Next 14 Social Media App",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}  >
                  <Navbar/>
              {children}
              
            
        </body>
      </html>
    </ClerkProvider>
  );
}