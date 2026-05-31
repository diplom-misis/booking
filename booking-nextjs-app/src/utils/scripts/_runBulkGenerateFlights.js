// Массовая генерация перелётов для замеров производительности.
// Запуск: открыть сайт в браузере, открыть DevTools → Console, скопировать содержимое файла, нажать Enter.
//
// Параметры по умолчанию: 25_000 базовых рейсов × 4 класса = 100_000 строк в таблице Flight.
// Батч: 50 базовых × 4 = 200 строк за HTTP-запрос. Всего ~500 запросов.
// Параллелизм: 5 одновременных запросов.

const BASE_FLIGHTS_TOTAL = 25_000;     // итого рейсов в Flight будет ×4
const BATCH_BASE_FLIGHTS = 50;          // базовых рейсов в одном HTTP-запросе (×4 строки)
const CONCURRENCY = 5;                  // одновременных запросов

// ---------------------------------------------------------------------------
// Хелперы (скопированы из _runGenerateFlights.js)
// ---------------------------------------------------------------------------

function getRandomFutureDate() {
  const now = new Date();
  const future = new Date();
  future.setMonth(now.getMonth() + 12);
  const randomTime =
    now.getTime() + Math.random() * (future.getTime() - now.getTime());
  return new Date(randomTime);
}

function getRandomFlightDuration() {
  return Math.floor(Math.random() * 12 * 60 * 60 * 1000) + 60 * 60 * 1000;
}

function getBasePrice(distanceKm) {
  if (distanceKm < 1000) return 5000 + Math.random() * 5000;
  if (distanceKm < 3000) return 10000 + Math.random() * 15000;
  return 20000 + Math.random() * 30000;
}

function calculateDistance() {
  return 500 + Math.random() * 9500;
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
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

function getAirlinesByRegion(country) {
  const regionAirlines = {
    Russia: ["Аэрофлот", "S7 Airlines", "Уральские авиалинии", "Победа", "Россия"],
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
    USA: ["Delta Air Lines", "American Airlines", "United Airlines"],
    Canada: ["Air Canada", "WestJet"],
    Mexico: ["Aeroméxico"],
    Panama: ["Copa Airlines"],
    Colombia: ["Avianca"],
    Peru: ["LATAM Peru"],
    Brazil: ["LATAM Brasil", "Gol Transportes Aéreos"],
    Argentina: ["Aerolíneas Argentinas"],
    Chile: ["LATAM Chile"],
    Uruguay: ["Amaszonas Uruguay"],
    Paraguay: ["Amaszonas Paraguay"],
    Bolivia: ["BoA"],
    Ecuador: ["LATAM Ecuador"],
    Venezuela: ["Conviasa"],
    Barbados: ["Caribbean Airlines"],
    "South Africa": ["South African Airways"],
    Egypt: ["EgyptAir"],
    Kenya: ["Kenya Airways"],
    Ethiopia: ["Ethiopian Airlines"],
    Madagascar: ["Air Madagascar"],
    Morocco: ["Royal Air Maroc"],
  };
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

// ---------------------------------------------------------------------------
// Генерация одного базового рейса (вернёт массив из 4-х: ECONOMY/COMFORT/BUSINESS/FIRST)
// ---------------------------------------------------------------------------

function buildOneBaseFlight(airports) {
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

  const distance = calculateDistance();
  const basePrice = getBasePrice(distance);
  const flightNumber = generateFlightNumber(company);

  const multipliers = { ECONOMY: 1, COMFORT: 1.5, BUSINESS: 2.5, FIRST: 4 };

  return Object.keys(multipliers).map((ticketClass) => ({
    departureAirport: fromAirport.code,
    departureDateTime: departureDateTime.toISOString(),
    arrivalAirport: toAirport.code,
    arrivalDateTime: arrivalDateTime.toISOString(),
    company,
    flightNumber,
    ticketClass,
    price: Math.round(basePrice * multipliers[ticketClass] * 100) / 100,
  }));
}

// ---------------------------------------------------------------------------
// Отправка одного батча
// ---------------------------------------------------------------------------

async function postBatch(batchData, batchIndex, totalBatches) {
  const t0 = performance.now();
  try {
    const response = await fetch("/api/flight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: batchData }),
    });
    const data = await response.json().catch(() => ({}));
    const elapsed = Math.round(performance.now() - t0);

    if (response.ok) {
      console.log(
        `[${batchIndex + 1}/${totalBatches}] OK (${elapsed}ms) created=${data.count ?? "?"} duplicates=${data.duplicatesIgnored ?? 0}`,
      );
      return { ok: true, created: data.count ?? 0 };
    } else {
      console.error(
        `[${batchIndex + 1}/${totalBatches}] FAIL (${elapsed}ms) status=${response.status}`,
        data,
      );
      return { ok: false, created: 0 };
    }
  } catch (err) {
    console.error(`[${batchIndex + 1}/${totalBatches}] ERROR`, err);
    return { ok: false, created: 0 };
  }
}

// ---------------------------------------------------------------------------
// Пул параллельных запросов
// ---------------------------------------------------------------------------

async function runPool(tasks, concurrency) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Главная функция
// ---------------------------------------------------------------------------

async function bulkSeed() {
  console.log(`Получаем список аэропортов...`);
  const response = await fetch("/api/airport");
  const { airports } = await response.json();

  if (!airports || airports.length < 2) {
    console.error("Недостаточно аэропортов. Сначала прогоните _runGenerateAirportsAndCities.js");
    return;
  }
  console.log(`Аэропортов: ${airports.length}`);

  const totalBatches = Math.ceil(BASE_FLIGHTS_TOTAL / BATCH_BASE_FLIGHTS);
  console.log(
    `Будет создано: ${BASE_FLIGHTS_TOTAL} базовых × 4 класса = ${BASE_FLIGHTS_TOTAL * 4} строк`,
  );
  console.log(`Батчей: ${totalBatches}, по ${BATCH_BASE_FLIGHTS * 4} строк, параллелизм ${CONCURRENCY}`);

  const startedAt = performance.now();

  const tasks = [];
  for (let b = 0; b < totalBatches; b++) {
    const baseInThisBatch =
      b === totalBatches - 1
        ? BASE_FLIGHTS_TOTAL - b * BATCH_BASE_FLIGHTS
        : BATCH_BASE_FLIGHTS;

    const batchData = [];
    for (let i = 0; i < baseInThisBatch; i++) {
      batchData.push(...buildOneBaseFlight(airports));
    }

    const idx = b;
    tasks.push(() => postBatch(batchData, idx, totalBatches));
  }

  const results = await runPool(tasks, CONCURRENCY);

  const totalCreated = results.reduce((sum, r) => sum + (r?.created ?? 0), 0);
  const totalFailed = results.filter((r) => !r?.ok).length;
  const elapsedSec = ((performance.now() - startedAt) / 1000).toFixed(1);

  console.log("================================");
  console.log(`Готово за ${elapsedSec}с`);
  console.log(`Создано строк: ${totalCreated}`);
  console.log(`Провалившихся батчей: ${totalFailed}`);
  console.log("================================");
  console.log("Дальше:");
  console.log("  1. Запустить _runGeneratePartiotions.js (раскидать рейсы по месячным партициям)");
  console.log("  2. Запустить _runGenerateRoutes.js (создать маршруты с пересадками)");
}

bulkSeed();