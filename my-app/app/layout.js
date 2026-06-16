import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css"; 
import 'react-toastify/dist/ReactToastify.css';




export const metadata = {
  title: "Your App",
  description: "Your Description",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><link rel="icon" href="/VZ-favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
     <body>{children}</body>
    </html>
  );
}
