import { Geist, Geist_Mono } from "next/font/google";
import AuthPage from "./auth";
import BookingAirplane from "./booking-airplane";
import BookingPage from "./booking-page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <BookingAirplane />
    </div>
  );
}
