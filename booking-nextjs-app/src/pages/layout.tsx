import { Logo } from "@/components/logo";
import Image from "next/image";
import defaultAvatar from "../images/default-avatar.svg";
import Link from "next/link";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<
    "booking" | "allBookings" | "profile"
  >("booking");

  return (
    <div className="flex flex-col">
      <header className="px-5 pt-2 pb-3 md:px-6 md:py-4 bg-white flex justify-between rounded-b-xl md:rounded-none border-b border-gray-200 relative z-[1]">
        <Logo className="hidden md:inline" />
        <nav className="flex gap-2 justify-between md:justify-end w-full">
          <div className="flex flex-row-reverse justify-between w-[calc(50%+12px)] md:w-auto md:flex-row relative">
            <div
              className={`flex gap-1.5 md:px-5 md:py-2 items-center [&_path]:hover:stroke-blue-600 hover:text-blue-500 cursor-pointer}`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.3321 4.71819L12.6235 2.47434C12.534 2.19107 12.2829 2 12 2C11.7171 2 11.466 2.19107 11.3765 2.47434L10.6679 4.71819C10.6088 4.9056 10.5673 5.09873 10.544 5.29476L10.1053 9L4.26559 13.1094C3.47492 13.6658 3 14.6025 3 15.6056V16L10.1053 14L10.5789 18L9.2079 18.7236C8.88695 18.893 8.68421 19.2393 8.68421 19.618V22L10.4585 21.0636C10.5387 21.0212 10.6216 20.985 10.7067 20.9551L11.4008 20.7108C11.7898 20.574 12.2102 20.574 12.5992 20.7108L13.2933 20.9551C13.3784 20.985 13.4613 21.0212 13.5415 21.0636L15.3158 22V19.618C15.3158 19.2393 15.1131 18.893 14.7921 18.7236L13.4211 18L13.8947 14L21 16V15.6056C21 14.6025 20.5251 13.6658 19.7344 13.1094L13.8947 9L13.456 5.29476C13.4327 5.09873 13.3912 4.9056 13.3321 4.71819Z"
                  stroke={`${currentPage === "booking" ? "#FFF" : "#1F2937"}`}
                  strokeWidth="1.5"
                />
              </svg>
              <Link
                href="/booking-airplane"
                className="text-sm hidden md:inline"
              >
                Поиск авиабилетов
              </Link>
              {currentPage === "booking" && (
                <div className="flex absolute size-7 rounded-full z-[3] bg-blue-500 right-0.5"></div>
              )}
            </div>
            <div className="flex gap-2 md:px-5 md:py-2 items-center [&_path]:hover:stroke-blue-600 hover:text-blue-500 cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6154 5.77778V6.55556M16.6154 9.66667V10.4444M16.6154 13.5556V14.3333M16.6154 17.4444V18.2222M3.15385 5C2.51692 5 2 5.52267 2 6.16667V9.30474C2.46846 9.57746 2.85756 9.97018 3.12812 10.4434C3.39868 10.9165 3.54113 11.4534 3.54113 12C3.54113 12.5466 3.39868 13.0835 3.12812 13.5566C2.85756 14.0298 2.46846 14.4225 2 14.6953V17.8333C2 18.4773 2.51692 19 3.15385 19H20.8462C21.4831 19 22 18.4773 22 17.8333V14.6953C21.5315 14.4225 21.1424 14.0298 20.8719 13.5566C20.6013 13.0835 20.4589 12.5466 20.4589 12C20.4589 11.4534 20.6013 10.9165 20.8719 10.4434C21.1424 9.97018 21.5315 9.57746 22 9.30474V6.16667C22 5.52267 21.4831 5 20.8462 5H3.15385Z"
                  stroke="#1F2937"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3909 9.21204L14.0646 7.9817C14.1496 7.82638 14.132 7.64666 14.0209 7.53553C13.9098 7.42441 13.73 7.40681 13.5747 7.49186L12.3444 8.16548C12.2416 8.22175 12.1434 8.28738 12.0511 8.36143L10.3067 9.76106L6.2692 9.21049C5.72254 9.13594 5.13857 9.34678 4.713 9.77235L4.54565 9.9397L8.18539 11.8824L6.67442 13.7655L5.82882 13.5339C5.63087 13.4797 5.40432 13.547 5.24362 13.7077L4.23304 14.7183L5.32734 15.018C5.3768 15.0315 5.42477 15.0487 5.47088 15.0694L5.84718 15.2385C6.05802 15.3332 6.22321 15.4984 6.31793 15.7092L6.487 16.0855C6.50771 16.1317 6.52491 16.1796 6.53846 16.2291L6.83817 17.3234L7.84875 16.3128C8.00945 16.1521 8.07671 15.9255 8.0225 15.7276L7.7909 14.882L9.67404 13.371L11.6167 17.0108L11.7841 16.8434C12.2096 16.4179 12.4205 15.8339 12.3459 15.2872L11.7954 11.2497L13.195 9.50534C13.269 9.41305 13.3347 9.31481 13.3909 9.21204Z"
                  fill="#1F2937"
                />
              </svg>
              <Link href="/booking-page" className="text-sm hidden md:inline">
                Бронирования
              </Link>
            </div>
          </div>

          <Image
            src={defaultAvatar}
            width={40}
            height={40}
            className="outline-1 rounded-full hover:outline hover:outline-blue-600 active:outline-2 cursor-pointer w-6 h-6 md:w-10 md:h-10"
            alt="Аватар пользователя"
          />
        </nav>
      </header>
      <div className="pl-5 pr-7 pt-5 md:py-8 flex-1">{children}</div>
    </div>
  );
}
