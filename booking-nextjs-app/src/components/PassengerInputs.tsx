import { useState } from "react";

type PassengerInputsData = {
  count: number;
};

export default function PassengerInputs({ count }: PassengerInputsData) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [passportSeries, setPassportSeries] = useState<string>("");
  const [passportNumber, setPassportNumber] = useState<string>("");

  const firstNameError = !/^[a-zа-я-]*$/i.test(firstName);
  const lastNameError = !/^[a-zа-я-]*$/i.test(lastName);
  const passportSeriesError = !/^[0-9]*$/.test(passportSeries);
  const passportNumberError = !/^[0-9]*$/.test(passportNumber);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <h3 className="font-bold">Данные пассажира {count}</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-xs">Имя</p>
            <input
              type="text"
              className="border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base"
              placeholder="Ярополк"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              pattern="[A-za-zА-яа-я\-]*$"
            />
            {firstNameError && (
              <p className="text-xs text-red-500 w-full md:max-w-[202px]">
                Имя может содержать только буквы и дефис
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-xs">Фамилия</p>
            <input
              type="text"
              className="border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base"
              placeholder="Иванов"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              pattern="[A-za-zА-яа-я\-]*$"
            />
            {lastNameError && (
              <p className="text-xs text-red-500 w-full md:max-w-[202px]">
                Фамилия может содержать только буквы и дефис
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-xs">Дата рождения</p>
            <input
              type="date"
              className="border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base"
              placeholder="04.06.1993"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
            />
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-gray-400 text-xs">Паспортные данные</p>
            <div className="flex gap-[6px]">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  className="border border-gray-300 rounded-sm px-[14px] py-2 w-full md:w-24 hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base"
                  placeholder="7341"
                  value={passportSeries}
                  onChange={(e) => setPassportSeries(e.target.value)}
                  maxLength={4}
                  pattern="\d*"
                />
                {passportSeriesError && (
                  <p className="text-xs text-red-500 max-w-36 md:max-w-24">
                    Серия паспорта может содержать только цифры
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  className="border border-gray-300 rounded-sm px-[14px] py-2 w-full md:w-24 hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base"
                  placeholder="71 34 30"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  maxLength={6}
                  pattern="\d*"
                />
                {passportNumberError && (
                  <p className="text-xs text-red-500 max-w-36 md:max-w-24">
                    Номер паспорта может содержать только цифры
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
