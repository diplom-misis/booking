import { Logo } from "@/components/logo";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface AuthLayoutProps {
  children: React.ReactNode;
  additionalBlock: React.ReactNode;
}

export default function AuthLayout({
  children,
  additionalBlock,
}: AuthLayoutProps) {
  return (
    <div>
      <div className="flex flex-col justify-center w-screen h-screen">
        <div className="flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1">
          <div className="hidden md:flex flex-col gap-10 rounded-lg px-4 py-5 self-center">
            <div className="flex flex-col gap-4">
              <Logo />
              <div className={`flex flex-col ${roboto.className} text-2xl`}>
                <p>Исследуйте вымышленные города</p>
                <p>из сказок, бронируя билеты</p>
                <p>легко и быстро.</p>
              </div>
            </div>
            {additionalBlock}
          </div>

          <div className="flex flex-col gap-6 bg-transparent px-5 md:px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans w-full md:w-auto md:min-w-[356px]">
            {children}
          </div>
        </div>
      </div>
      <div className="md:hidden absolute bottom-5 left-5 z-10">
        {additionalBlock}
      </div>
    </div>
  );
}
