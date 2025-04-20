// Скрипт для создания городов и аэропортов

const airports = [
  // Россия (30 основных)
  { code: "SVO", name: "Шереметьево", country: "Russia" },
  { code: "DME", name: "Домодедово", country: "Russia" },
  { code: "VKO", name: "Внуково", country: "Russia" },
  { code: "LED", name: "Пулково", country: "Russia" },
  { code: "AER", name: "Сочи", country: "Russia" },
  { code: "KZN", name: "Казань", country: "Russia" },
  { code: "SVX", name: "Кольцово", country: "Russia" },
  { code: "ROV", name: "Платов", country: "Russia" },
  { code: "UFA", name: "Уфа", country: "Russia" },
  { code: "KRR", name: "Пашковский", country: "Russia" },
  { code: "OVB", name: "Толмачёво", country: "Russia" },
  { code: "KJA", name: "Емельяново", country: "Russia" },
  { code: "OMS", name: "Омск", country: "Russia" },
  { code: "CEK", name: "Челябинск", country: "Russia" },
  { code: "MRV", name: "Минеральные Воды", country: "Russia" },
  { code: "GOJ", name: "Стригино", country: "Russia" },
  { code: "KUF", name: "Курумоч", country: "Russia" },
  { code: "BQS", name: "Игнатьево", country: "Russia" },
  { code: "KGD", name: "Храброво", country: "Russia" },
  { code: "AAQ", name: "Витязево", country: "Russia" },
  { code: "VVO", name: "Кневичи", country: "Russia" },
  { code: "PEE", name: "Большое Савино", country: "Russia" },
  { code: "MMK", name: "Мурманск", country: "Russia" },
  { code: "ARH", name: "Талаги", country: "Russia" },
  { code: "KHV", name: "Новый", country: "Russia" },
  { code: "UUS", name: "Южно-Сахалинск", country: "Russia" },
  { code: "IKT", name: "Иркутск", country: "Russia" },
  { code: "BTK", name: "Братск", country: "Russia" },
  { code: "GDX", name: "Магадан", country: "Russia" },
  { code: "DYR", name: "Анадырь", country: "Russia" },

  // Европа (20)
  { code: "CDG", name: "Шарль де Голль", country: "France" },
  { code: "LHR", name: "Хитроу", country: "UK" },
  { code: "FRA", name: "Франкфурт", country: "Germany" },
  { code: "AMS", name: "Схипхол", country: "Netherlands" },
  { code: "MAD", name: "Барахас", country: "Spain" },
  { code: "BCN", name: "Эль Прат", country: "Spain" },
  { code: "FCO", name: "Фьюмичино", country: "Italy" },
  { code: "LIS", name: "Портела", country: "Portugal" },
  { code: "VIE", name: "Швехат", country: "Austria" },
  { code: "PRG", name: "Вацлав Гавел", country: "Czech Republic" },
  { code: "ZRH", name: "Цюрих", country: "Switzerland" },
  { code: "DUB", name: "Дублин", country: "Ireland" },
  { code: "BER", name: "Бранденбург", country: "Germany" },
  { code: "WAW", name: "Шопен", country: "Poland" },
  { code: "BUD", name: "Ференц Лист", country: "Hungary" },
  { code: "HEL", name: "Хельсинки-Вантаа", country: "Finland" },
  { code: "OSL", name: "Гардермуэн", country: "Norway" },
  { code: "ARN", name: "Арланда", country: "Sweden" },
  { code: "CPH", name: "Каструп", country: "Denmark" },
  { code: "IST", name: "Стамбул", country: "Turkey" },

  // Азия (15)
  { code: "DXB", name: "Дубай", country: "UAE" },
  { code: "HKG", name: "Гонконг", country: "China" },
  { code: "PEK", name: "Пекин", country: "China" },
  { code: "PVG", name: "Шанхай Пудун", country: "China" },
  { code: "NRT", name: "Нарита", country: "Japan" },
  { code: "HND", name: "Ханеда", country: "Japan" },
  { code: "ICN", name: "Инчхон", country: "South Korea" },
  { code: "SIN", name: "Чанги", country: "Singapore" },
  { code: "BKK", name: "Суварнабхуми", country: "Thailand" },
  { code: "DEL", name: "Индира Ганди", country: "India" },
  { code: "KUL", name: "Куала-Лумпур", country: "Malaysia" },
  { code: "DOH", name: "Хамад", country: "Qatar" },
  { code: "TLV", name: "Бен-Гурион", country: "Israel" },
  { code: "JED", name: "Король Абдулазиз", country: "Saudi Arabia" },
  { code: "HAN", name: "Нойбай", country: "Vietnam" },

  // Северная Америка (15)
  { code: "JFK", name: "Джон Кеннеди", country: "USA" },
  { code: "LAX", name: "Лос-Анджелес", country: "USA" },
  { code: "ORD", name: "О'Хара", country: "USA" },
  { code: "DFW", name: "Даллас/Форт-Уэрт", country: "USA" },
  { code: "MIA", name: "Майами", country: "USA" },
  { code: "SFO", name: "Сан-Франциско", country: "USA" },
  { code: "SEA", name: "Сиэтл-Такома", country: "USA" },
  { code: "YYZ", name: "Торонто Пирсон", country: "Canada" },
  { code: "YVR", name: "Ванкувер", country: "Canada" },
  { code: "YUL", name: "Монреаль", country: "Canada" },
  { code: "MEX", name: "Мехико", country: "Mexico" },
  { code: "CUN", name: "Канкун", country: "Mexico" },
  { code: "PTY", name: "Токумен", country: "Panama" },
  { code: "BOG", name: "Эльдорадо", country: "Colombia" },
  { code: "LIM", name: "Хорхе Чавес", country: "Peru" },

  // Южная Америка (10)
  { code: "GRU", name: "Гуарульюс", country: "Brazil" },
  { code: "GIG", name: "Галеан", country: "Brazil" },
  { code: "EZE", name: "Эсейса", country: "Argentina" },
  { code: "SCL", name: "Артуро Мерино Бенитес", country: "Chile" },
  { code: "MVD", name: "Карраско", country: "Uruguay" },
  { code: "ASU", name: "Сильвио Петтиросси", country: "Paraguay" },
  { code: "LPB", name: "Эль-Альто", country: "Bolivia" },
  { code: "UIO", name: "Марискаль Сукре", country: "Ecuador" },
  { code: "CCS", name: "Симон Боливар", country: "Venezuela" },
  { code: "BGI", name: "Грантли Адамс", country: "Barbados" },

  // Африка (10)
  { code: "JNB", name: "Тамбо", country: "South Africa" },
  { code: "CPT", name: "Кейптаун", country: "South Africa" },
  { code: "CAI", name: "Каир", country: "Egypt" },
  { code: "HRG", name: "Хургада", country: "Egypt" },
  { code: "NBO", name: "Джомо Кеньятта", country: "Kenya" },
  { code: "MBA", name: "Мой", country: "Kenya" },
  { code: "ADD", name: "Боле", country: "Ethiopia" },
  { code: "DUR", name: "Кинг Шака", country: "South Africa" },
  { code: "TNR", name: "Ивату", country: "Madagascar" },
  { code: "CMN", name: "Мухаммед V", country: "Morocco" },
];

// Соответствующие города (в том же порядке)
const cities = [
  // Россия
  "Москва",
  "Москва",
  "Москва",
  "Санкт-Петербург",
  "Сочи",
  "Казань",
  "Екатеринбург",
  "Ростов-на-Дону",
  "Уфа",
  "Краснодар",
  "Новосибирск",
  "Красноярск",
  "Омск",
  "Челябинск",
  "Минеральные Воды",
  "Нижний Новгород",
  "Самара",
  "Благовещенск",
  "Калининград",
  "Анапа",
  "Владивосток",
  "Пермь",
  "Мурманск",
  "Архангельск",
  "Хабаровск",
  "Южно-Сахалинск",
  "Иркутск",
  "Братск",
  "Магадан",
  "Анадырь",

  // Европа
  "Париж",
  "Лондон",
  "Франкфурт",
  "Амстердам",
  "Мадрид",
  "Барселона",
  "Рим",
  "Лиссабон",
  "Вена",
  "Прага",
  "Цюрих",
  "Дублин",
  "Берлин",
  "Варшава",
  "Будапешт",
  "Хельсинки",
  "Осло",
  "Стокгольм",
  "Копенгаген",
  "Стамбул",

  // Азия
  "Дубай",
  "Гонконг",
  "Пекин",
  "Шанхай",
  "Токио",
  "Токио",
  "Сеул",
  "Сингапур",
  "Бангкок",
  "Дели",
  "Куала-Лумпур",
  "Доха",
  "Тель-Авив",
  "Джидда",
  "Ханой",

  // Северная Америка
  "Нью-Йорк",
  "Лос-Анджелес",
  "Чикаго",
  "Даллас",
  "Майами",
  "Сан-Франциско",
  "Сиэтл",
  "Торонто",
  "Ванкувер",
  "Монреаль",
  "Мехико",
  "Канкун",
  "Панама",
  "Богота",
  "Лима",

  // Южная Америка
  "Сан-Паулу",
  "Рио-де-Жанейро",
  "Буэнос-Айрес",
  "Сантьяго",
  "Монтевидео",
  "Асунсьон",
  "Ла-Пас",
  "Кито",
  "Каракас",
  "Бриджтаун",

  // Африка
  "Йоханнесбург",
  "Кейптаун",
  "Каир",
  "Хургада",
  "Найроби",
  "Момбаса",
  "Аддис-Абеба",
  "Дурбан",
  "Антананариву",
  "Касабланка",
];

async function createCity(cityName) {
  try {
    const response = await fetch("/api/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cityName }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`Город ${cityName} создан:`, data.city.id);
      return data.city.id;
    } else {
      console.error(`Ошибка при создании города ${cityName}:`, data.message);
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при создании города ${cityName}:`, error);
    return null;
  }
}

async function createAirport(airportData, cityId) {
  try {
    const response = await fetch("/api/airport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: airportData.name,
        code: airportData.code,
        cityId: cityId,
        country: airportData.country,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`Аэропорт ${airportData.code} создан:`, data.airport.id);
      return data.airport.id;
    } else {
      console.error(
        `Ошибка при создании аэропорта ${airportData.code}:`,
        data.message,
      );
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при создании аэропорта ${airportData.code}:`, error);
    return null;
  }
}

async function seedCitiesAndAirports() {
  const uniqueCities = [...new Set(cities)];
  const cityMap = new Map();

  for (const cityName of uniqueCities) {
    const cityId = await createCity(cityName);
    if (cityId) {
      cityMap.set(cityName, cityId);
    } else {
      try {
        const response = await fetch(
          `/api/city?search=${encodeURIComponent(cityName)}`,
        );
        const data = await response.json();
        if (data.cities && data.cities.length > 0) {
          cityMap.set(cityName, data.cities[0].id);
          console.log(`Город ${cityName} найден:`, data.cities[0].id);
        }
      } catch (error) {
        console.error(`Ошибка при поиске города ${cityName}:`, error);
      }
    }
  }

  for (let i = 0; i < airports.length; i++) {
    const airport = airports[i];
    const cityName = cities[i];
    const cityId = cityMap.get(cityName);
    if (cityId) {
      await createAirport(airport, cityId);
    } else {
      console.error(
        `Не найден ID города для ${cityName}, аэропорт ${airport.code} не создан`,
      );
    }
  }
}

seedCitiesAndAirports().then(() => {
  console.log("Завершено создание городов и аэропортов");
});
