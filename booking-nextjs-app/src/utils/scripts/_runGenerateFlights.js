// Скрипт для создания перелетов с учетом всех классов обслуживания

function getRandomFutureDate() {
  const now = new Date();
  const future = new Date();
  future.setMonth(now.getMonth() + 12);

  const randomTime =
    now.getTime() + Math.random() * (future.getTime() - now.getTime());
  return new Date(randomTime);
}

function getRandomFlightDuration() {
  return Math.floor(Math.random() * 12 * 60 * 60 * 1000) + 60 * 60 * 1000; // 1-12 часов в миллисекундах
}

async function getAirports() {
  try {
    const response = await fetch("/api/airport");
    const data = await response.json();
    return data.airports;
  } catch (error) {
    console.error("Ошибка при получении списка аэропортов:", error);
    return [];
  }
}

async function createFlights(flightsData) {
  try {
    const response = await fetch("/api/flight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: flightsData }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`Перелеты созданы.`);
      return true;
    } else {
      console.error(`Ошибка при создании перелета:`, data.message);
      return false;
    }
  } catch (error) {
    console.error(`Ошибка при создании перелета:`, error);
    return false;
  }
}

function getBasePrice(distanceKm) {
  if (distanceKm < 1000) return 5000 + Math.random() * 5000; // 5000-10000
  if (distanceKm < 3000) return 10000 + Math.random() * 15000; // 10000-25000
  return 20000 + Math.random() * 30000; // 20000-50000
}

function calculateDistance(fromAirport, toAirport) {
  return 500 + Math.random() * 9500; // 500-10000 км
}

function generateFlightNumber(company) {
  const airlineCodes = {
    Аэрофлот: "SU",
    "S7 Airlines": "S7",
    "Уральские авиалинии": "U6",
    Победа: "DP",
    Россия: "FV",
    Emirates: "EK",
    Lufthansa: "LH",
    "Air France": "AF",
    "British Airways": "BA",
    "Turkish Airlines": "TK",
    "Qatar Airways": "QR",
    "Singapore Airlines": "SQ",
    Delta: "DL",
  };

  const prefix =
    airlineCodes[company] ||
    company.slice(0, 2).toUpperCase().replace(/\s/g, "");

  const num = Math.floor(100 + Math.random() * 900); // 100-999
  return `${prefix}${num}`;
}

function getAirlinesByRegion(country) {
  const regionAirlines = {
    // Россия
    Russia: [
      "Аэрофлот",
      "S7 Airlines",
      "Уральские авиалинии",
      "Победа",
      "Россия",
    ],

    // Европа
    France: ["Air France"],
    UK: ["British Airways"],
    Germany: ["Lufthansa"],
    Netherlands: ["KLM"],
    Spain: ["Iberia"],
    Italy: ["Alitalia"],
    Portugal: ["TAP Portugal"],
    Austria: ["Austrian Airlines"],
    "Czech Republic": ["Czech Airlines"],
    Switzerland: ["Swiss International Air Lines"],
    Ireland: ["Aer Lingus"],
    Poland: ["LOT Polish Airlines"],
    Hungary: ["Wizz Air"],
    Finland: ["Finnair"],
    Norway: ["Norwegian Air Shuttle"],
    Sweden: ["SAS"],
    Denmark: ["SAS"],
    Turkey: ["Turkish Airlines"],

    // Азия
    UAE: ["Emirates", "Etihad Airways"],
    China: ["China Southern Airlines", "Air China"],
    Japan: ["Japan Airlines", "ANA"],
    "South Korea": ["Korean Air"],
    Singapore: ["Singapore Airlines"],
    Thailand: ["Thai Airways"],
    India: ["Air India"],
    Malaysia: ["Malaysia Airlines"],
    Qatar: ["Qatar Airways"],
    Israel: ["El Al"],
    "Saudi Arabia": ["Saudia"],
    Vietnam: ["Vietnam Airlines"],

    // Северная Америка
    USA: ["Delta Air Lines", "American Airlines", "United Airlines"],
    Canada: ["Air Canada", "WestJet"],
    Mexico: ["Aeroméxico"],
    Panama: ["Copa Airlines"],
    Colombia: ["Avianca"],
    Peru: ["LATAM Peru"],

    // Южная Америка
    Brazil: ["LATAM Brasil", "Gol Transportes Aéreos"],
    Argentina: ["Aerolíneas Argentinas"],
    Chile: ["LATAM Chile"],
    Uruguay: ["Amaszonas Uruguay"],
    Paraguay: ["Amaszonas Paraguay"],
    Bolivia: ["BoA"],
    Ecuador: ["LATAM Ecuador"],
    Venezuela: ["Conviasa"],
    Barbados: ["Caribbean Airlines"],

    // Африка
    "South Africa": ["South African Airways"],
    Egypt: ["EgyptAir"],
    Kenya: ["Kenya Airways"],
    Ethiopia: ["Ethiopian Airlines"],
    Madagascar: ["Air Madagascar"],
    Morocco: ["Royal Air Maroc"],
  };

  // Находим авиакомпании для страны или возвращаем международные
  return (
    regionAirlines[country] || [
      "Emirates",
      "Qatar Airways",
      "Turkish Airlines",
      "Lufthansa",
      "Air France",
      "British Airways",
    ]
  );
}

async function seedFlights() {
  const airports = await getAirports();
  if (airports.length < 2) {
    console.error("Недостаточно аэропортов для создания перелетов");
    return;
  }

  // Создаем 50 базовых рейсов (для каждого будет 4 класса)
  const baseFlightsCount = 50;
  const flightToCreate = [];

  for (let i = 0; i < baseFlightsCount; i++) {
    let fromAirport, toAirport;
    do {
      fromAirport = airports[Math.floor(Math.random() * airports.length)];
      toAirport = airports[Math.floor(Math.random() * airports.length)];
    } while (fromAirport.code === toAirport.code);

    const departureDateTime = getRandomFutureDate();
    const duration = getRandomFlightDuration();
    const arrivalDateTime = new Date(departureDateTime.getTime() + duration);

    const airlines = getAirlinesByRegion(fromAirport.country);
    const company = airlines[Math.floor(Math.random() * airlines.length)];

    const distance = calculateDistance(fromAirport, toAirport);
    const basePrice = getBasePrice(distance);

    const flightNumber = generateFlightNumber(company);

    const ticketClasses = ["ECONOMY", "COMFORT", "BUSINESS", "FIRST"];

    for (const ticketClass of ticketClasses) {
      let price;
      switch (ticketClass) {
        case "ECONOMY":
          price = basePrice;
          break;
        case "COMFORT":
          price = basePrice * 1.5;
          break;
        case "BUSINESS":
          price = basePrice * 2.5;
          break;
        case "FIRST":
          price = basePrice * 4;
          break;
        default:
          price = basePrice;
      }

      const flightData = {
        departureAirport: fromAirport.code,
        departureDateTime: departureDateTime.toISOString(),
        arrivalAirport: toAirport.code,
        arrivalDateTime: arrivalDateTime.toISOString(),
        company,
        flightNumber,
        ticketClass,
        price: Math.round(price * 100) / 100, // Округляем до 2 знаков
      };

      flightToCreate.push(flightData);
    }
  }

  await createFlights(flightToCreate);
}

seedFlights().then(() => {
  console.log("Завершено создание перелетов");
});
