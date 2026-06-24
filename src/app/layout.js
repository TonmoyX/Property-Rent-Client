import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { ToastContainer } from "react-toastify";

// Configure the Roboto font family
const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "Proprent",
  description: "Proprent is a property rental platform that connects tenants and landlords, providing a seamless experience for finding and managing rental properties.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar></Navbar>
        <ToastContainer />
        <main className="flex-grow">{children}</main>
        <Footer></Footer>
      </body>
    </html>
  );
}