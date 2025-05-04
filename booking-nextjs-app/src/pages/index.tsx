import { Geist, Geist_Mono } from "next/font/google";
import { Layout } from "./layout";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import plane from "@/images/plane.svg";
import { Logo } from "@/components/logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const popularRoutes = [
  {
    id: "1",
    direction: "Москва",
    price: 1000,
  },
  {
    id: "2",
    direction: "Нижний новгород",
    price: 2000,
  },
  {
    id: "3",
    direction: "Казань",
    price: 2500,
  },
  {
    id: "4",
    direction: "Ванкувер",
    price: 3000,
  },
];

export default function Home() {
  const router = useRouter();

  const routePopularNavigate = (item: any) => {
    router.push(`/booking-airplane?toCity=${item.direction}`);
  };

  return (
    <Layout>
      <div className="flex flex-col md:gap-[92px] gap-6 lg:px-[110px]">
        <div className="flex flex-col gap-4 items-center justify-center lg:justify-center">
          <div className="flex md:hidden items-start pt-10 self-start">
            <Logo />
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-[578px] text-left lg:text-center lg:pt-16">
            <p className="text-3xl text-gray-800 font-bold font-roboto text-wrap">
              Yaplex Travel приглашает вас в мир волшебных путешествий!
            </p>
            <p className="text-base text-gray-800 font-inter">
              Исследуйте вымышленные города из сказок,
              <br />
              бронируя билеты легко и быстро.
            </p>
            <div className="pt-6 pb-8 flex justify-start lg:justify-center">
              <Link
                href="/booking-airplane"
                className="md:w-[191px] w-full h-10 bg-blue-500 rounded-lg flex justify-center items-center"
              >
                <p className="text-base text-white font-bold font-inter">
                  Поиск авиабилетов
                </p>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto">
          {[
            {
              title: "Путешествие в тридевятое царство",
              desc: "Скидки до 50% на сказочные маршруты",
            },
            {
              title: "Семейные приключения",
              desc: "Специальные цены для больших компаний",
            },
            {
              title: "Полет на ковре-самолёте",
              desc: "Откройте для себя дальние края на ковре-самолёте!",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[314px] h-[152px] bg-blue-500 rounded-xl p-4 flex flex-col justify-between lg:w-[380px] lg:h-[200px] lg:px-6 lg:py-5"
            >
              <div className="flex flex-col gap-2">
                <p className="lg:text-xl text-base text-white font-bold font-roboto">
                  {card.title}
                </p>
                <p className="lg:text-base text-sm text-white font-inter">
                  {card.desc}
                </p>
              </div>
              <Button className="flex items-center h-10 border border-white rounded-lg justify-center w-[180px]">
                <p className="text-white lg:text-base text-sm font-bold font-inter">
                  Узнать больше
                </p>
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl text-gray-800 font-bold font-roboto">
            Популярные направления
          </h2>
          <div className="flex gap-4 overflow-x-auto">
            {popularRoutes.map((route) => (
              <div
                key={route.id}
                className="flex-shrink-0 w-[224px] h-[184px] shadow-[0_8px_16px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden"
              >
                <div className="flex flex-col h-full">
                  <div className="h-12 bg-red-500 px-6 py-3 flex flex-row gap-2 items-center">
                    <Image
                      src={plane}
                      width={24}
                      height={24}
                      alt="Иконка самолета"
                    />
                    <p className="text-sm font-bold text-white font-inter">
                      {route.direction}
                    </p>
                  </div>
                  <div className="px-6 py-3 bg-white flex flex-col justify-between flex-1">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-500 font-inter">
                        Туда и обратно
                      </p>
                      <div className="flex flex-row gap-2 items-center">
                        <p className="text-base">от</p>
                        <p className="text-2xl font-bold text-green-500 font-roboto">
                          {route.price} ₽
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => routePopularNavigate(route)}
                      className="flex items-center h-10 w-full border border-gray-300 rounded-lg justify-center lg:w-[146px]"
                    >
                      <p className="text-base text-gray-800 font-bold font-inter">
                        Найти билеты
                      </p>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold font-roboto">Мы предлагаем:</h2>
          <p className="text-base font-inter text-gray-800">
            Yaplex Travel приглашает вас в мир волшебных путешествий! Исследуйте
            вымышленные города из легенд и сказок,  бронируя билеты легко
            и быстро.
          </p>
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex items-start">
              <span className="font-bold mr-1 text-base font-inter">1.</span>
              <span className="text-base font-inter">
                Прямой доступ к сказочным направлениям.
              </span>
            </div>
            <div className="flex items-start">
              <span className="font-bold mr-1 text-base font-inter">2.</span>
              <span className="text-base font-inter">
                Гибкость бронирования на любой случай.
              </span>
            </div>
            <div className="flex items-start">
              <span className="font-bold mr-1 text-base font-inter">3.</span>
              <span className="text-base font-inter">
                Поддержка 24/7 на пути в ваше приключение.
              </span>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-6 w-full">
          <h2 className="text-2xl font-bold font-roboto">
            Контактная информация
          </h2>
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-inter text-gray-600">Адрес офиса:</p>
              <p className="text-base font-inter">
                Тридевятое царство, Златая улица, дом 3
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-inter text-gray-600">Телефон:</p>
              <p className="text-base font-inter">+7 495 123-45-67</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-inter text-gray-600">Email:</p>
              <p className="text-base font-inter">travel@yasky.com</p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
