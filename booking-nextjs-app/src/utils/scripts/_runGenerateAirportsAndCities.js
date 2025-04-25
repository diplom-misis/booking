// Скрипт для создания городов и аэропортов

const airports = [
  // Россия (30 основных)
  { code: "SVO", name: "Шереметьево" },
  { code: "DME", name: "Домодедово" },
  { code: "VKO", name: "Внуково" },
  { code: "LED", name: "Пулково" },
  { code: "AER", name: "Сочи" },
  { code: "KZN", name: "Казань" },
  { code: "SVX", name: "Кольцово" },
  { code: "ROV", name: "Платов" },
  { code: "UFA", name: "Уфа" },
  { code: "KRR", name: "Пашковский" },
  { code: "OVB", name: "Толмачёво" },
  { code: "KJA", name: "Емельяново" },
  { code: "OMS", name: "Омск" },
  { code: "CEK", name: "Челябинск" },
  { code: "MRV", name: "Минеральные Воды" },
  { code: "GOJ", name: "Стригино" },
  { code: "KUF", name: "Курумоч" },
  { code: "BQS", name: "Игнатьево" },
  { code: "KGD", name: "Храброво" },
  { code: "AAQ", name: "Витязево" },
  { code: "VVO", name: "Кневичи" },
  { code: "PEE", name: "Большое Савино" },
  { code: "MMK", name: "Мурманск" },
  { code: "ARH", name: "Талаги" },
  { code: "KHV", name: "Новый" },
  { code: "UUS", name: "Южно-Сахалинск" },
  { code: "IKT", name: "Иркутск" },
  { code: "BTK", name: "Братск" },
  { code: "GDX", name: "Магадан" },
  { code: "DYR", name: "Анадырь" },

  // Европа (20)
  { code: "CDG", name: "Шарль де Голль" },
  { code: "LHR", name: "Хитроу" },
  { code: "FRA", name: "Франкфурт" },
  { code: "AMS", name: "Схипхол" },
  { code: "MAD", name: "Барахас" },
  { code: "BCN", name: "Эль Прат" },
  { code: "FCO", name: "Фьюмичино" },
  { code: "LIS", name: "Портела" },
  { code: "VIE", name: "Швехат" },
  { code: "PRG", name: "Вацлав Гавел" },
  { code: "ZRH", name: "Цюрих" },
  { code: "DUB", name: "Дублин" },
  { code: "BER", name: "Бранденбург" },
  { code: "WAW", name: "Шопен" },
  { code: "BUD", name: "Ференц Лист" },
  { code: "HEL", name: "Хельсинки-Вантаа" },
  { code: "OSL", name: "Гардермуэн" },
  { code: "ARN", name: "Арланда" },
  { code: "CPH", name: "Каструп" },
  { code: "IST", name: "Стамбул" },

  // Азия (15)
  { code: "DXB", name: "Дубай" },
  { code: "HKG", name: "Гонконг" },
  { code: "PEK", name: "Пекин" },
  { code: "PVG", name: "Шанхай Пудун" },
  { code: "NRT", name: "Нарита" },
  { code: "HND", name: "Ханеда" },
  { code: "ICN", name: "Инчхон" },
  { code: "SIN", name: "Чанги" },
  { code: "BKK", name: "Суварнабхуми" },
  { code: "DEL", name: "Индира Ганди" },
  { code: "KUL", name: "Куала-Лумпур" },
  { code: "DOH", name: "Хамад" },
  { code: "TLV", name: "Бен-Гурион" },
  { code: "JED", name: "Король Абдулазиз" },
  { code: "HAN", name: "Нойбай" },

  // Северная Америка (15)
  { code: "JFK", name: "Джон Кеннеди" },
  { code: "LAX", name: "Лос-Анджелес" },
  { code: "ORD", name: "О'Хара" },
  { code: "DFW", name: "Даллас/Форт-Уэрт" },
  { code: "MIA", name: "Майами" },
  { code: "SFO", name: "Сан-Франциско" },
  { code: "SEA", name: "Сиэтл-Такома" },
  { code: "YYZ", name: "Торонто Пирсон" },
  { code: "YVR", name: "Ванкувер" },
  { code: "YUL", name: "Монреаль" },
  { code: "MEX", name: "Мехико" },
  { code: "CUN", name: "Канкун" },
  { code: "PTY", name: "Токумен" },
  { code: "BOG", name: "Эльдорадо" },
  { code: "LIM", name: "Хорхе Чавес" },

  // Южная Америка (10)
  { code: "GRU", name: "Гуарульюс" },
  { code: "GIG", name: "Галеан" },
  { code: "EZE", name: "Эсейса" },
  { code: "SCL", name: "Артуро Мерино Бенитес" },
  { code: "MVD", name: "Карраско" },
  { code: "ASU", name: "Сильвио Петтиросси" },
  { code: "LPB", name: "Эль-Альто" },
  { code: "UIO", name: "Марискаль Сукре" },
  { code: "CCS", name: "Симон Боливар" },
  { code: "BGI", name: "Грантли Адамс" },

  // Африка (10)
  { code: "JNB", name: "Тамбо" },
  { code: "CPT", name: "Кейптаун" },
  { code: "CAI", name: "Каир" },
  { code: "HRG", name: "Хургада" },
  { code: "NBO", name: "Джомо Кеньятта" },
  { code: "MBA", name: "Мой" },
  { code: "ADD", name: "Боле" },
  { code: "DUR", name: "Кинг Шака" },
  { code: "TNR", name: "Ивату" },
  { code: "CMN", name: "Мухаммед V" },
];

// Соответствующие города (в том же порядке)
const cities = [
  // Россия
  { city: "Москва", country: "Россия" },
  { city: "Москва", country: "Россия" },
  { city: "Москва", country: "Россия" },
  { city: "Санкт-Петербург", country: "Россия" },
  { city: "Сочи", country: "Россия" },
  { city: "Казань", country: "Россия" },
  { city: "Екатеринбург", country: "Россия" },
  { city: "Ростов-на-Дону", country: "Россия" },
  { city: "Уфа", country: "Россия" },
  { city: "Краснодар", country: "Россия" },
  { city: "Новосибирск", country: "Россия" },
  { city: "Красноярск", country: "Россия" },
  { city: "Омск", country: "Россия" },
  { city: "Челябинск", country: "Россия" },
  { city: "Минеральные Воды", country: "Россия" },
  { city: "Нижний Новгород", country: "Россия" },
  { city: "Самара", country: "Россия" },
  { city: "Благовещенск", country: "Россия" },
  { city: "Калининград", country: "Россия" },
  { city: "Анапа", country: "Россия" },
  { city: "Владивосток", country: "Россия" },
  { city: "Пермь", country: "Россия" },
  { city: "Мурманск", country: "Россия" },
  { city: "Архангельск", country: "Россия" },
  { city: "Хабаровск", country: "Россия" },
  { city: "Южно-Сахалинск", country: "Россия" },
  { city: "Иркутск", country: "Россия" },
  { city: "Братск", country: "Россия" },
  { city: "Магадан", country: "Россия" },
  { city: "Анадырь", country: "Россия" },

  // Европа
  { city: "Париж", country: "Франция" },
  { city: "Лондон", country: "Великобритания" },
  { city: "Франкфурт", country: "Германия" },
  { city: "Амстердам", country: "Нидерланды" },
  { city: "Мадрид", country: "Испания" },
  { city: "Барселона", country: "Испания" },
  { city: "Рим", country: "Италия" },
  { city: "Лиссабон", country: "Португалия" },
  { city: "Вена", country: "Австрия" },
  { city: "Прага", country: "Чехия" },
  { city: "Цюрих", country: "Швейцария" },
  { city: "Дублин", country: "Ирландия" },
  { city: "Берлин", country: "Германия" },
  { city: "Варшава", country: "Польша" },
  { city: "Будапешт", country: "Венгрия" },
  { city: "Хельсинки", country: "Финляндия" },
  { city: "Осло", country: "Норвегия" },
  { city: "Стокгольм", country: "Швеция" },
  { city: "Копенгаген", country: "Дания" },
  { city: "Стамбул", country: "Турция" },

  // Азия
  { city: "Дубай", country: "ОАЭ" },
  { city: "Гонконг", country: "Китай" },
  { city: "Пекин", country: "Китай" },
  { city: "Шанхай", country: "Китай" },
  { city: "Токио", country: "Япония" },
  { city: "Токио", country: "Япония" },
  { city: "Сеул", country: "Южная Корея" },
  { city: "Сингапур", country: "Сингапур" },
  { city: "Бангкок", country: "Таиланд" },
  { city: "Дели", country: "Индия" },
  { city: "Куала-Лумпур", country: "Малайзия" },
  { city: "Доха", country: "Катар" },
  { city: "Тель-Авив", country: "Израиль" },
  { city: "Джидда", country: "Саудовская Аравия" },
  { city: "Ханой", country: "Вьетнам" },

  // Северная Америка
  { city: "Нью-Йорк", country: "США" },
  { city: "Лос-Анджелес", country: "США" },
  { city: "Чикаго", country: "США" },
  { city: "Даллас", country: "США" },
  { city: "Майами", country: "США" },
  { city: "Сан-Франциско", country: "США" },
  { city: "Сиэтл", country: "США" },
  { city: "Торонто", country: "Канада" },
  { city: "Ванкувер", country: "Канада" },
  { city: "Монреаль", country: "Канада" },
  { city: "Мехико", country: "Мексика" },
  { city: "Канкун", country: "Мексика" },
  { city: "Панама", country: "Панама" },
  { city: "Богота", country: "Колумбия" },
  { city: "Лима", country: "Перу" },

  // Южная Америка
  { city: "Сан-Паулу", country: "Бразилия" },
  { city: "Рио-де-Жанейро", country: "Бразилия" },
  { city: "Буэнос-Айрес", country: "Аргентина" },
  { city: "Сантьяго", country: "Чили" },
  { city: "Монтевидео", country: "Уругвай" },
  { city: "Асунсьон", country: "Парагвай" },
  { city: "Ла-Пас", country: "Боливия" },
  { city: "Кито", country: "Эквадор" },
  { city: "Каракас", country: "Венесуэла" },
  { city: "Бриджтаун", country: "Барбадос" },

  // Африка
  { city: "Йоханнесбург", country: "ЮАР" },
  { city: "Кейптаун", country: "ЮАР" },
  { city: "Каир", country: "Египет" },
  { city: "Хургада", country: "Египет" },
  { city: "Найроби", country: "Кения" },
  { city: "Момбаса", country: "Кения" },
  { city: "Аддис-Абеба", country: "Эфиопия" },
  { city: "Дурбан", country: "ЮАР" },
  { city: "Антананариву", country: "Мадагаскар" },
  { city: "Касабланка", country: "Марокко" },
];

async function createCountry(countryName) {
  try {
    const response = await fetch("/api/country", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: countryName }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`Страна ${countryName} создана:`, data.country.id);
      return data.country.id;
    } else {
      console.error(`Ошибка при создании страны ${countryName}:`, data.message);
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при создании страны ${countryName}:`, error);
    return null;
  }
}

async function createCity(cityName, countryId) {
  try {
    const response = await fetch("/api/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cityName, countryId }),
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

  for (const obj of uniqueCities) {
    const { city: cityName, country } = obj;

    let countryId = await createCountry(country);
    if (!countryId) {
      try {
        const response = await fetch(
          `/api/country?search=${encodeURIComponent(country)}`,
        );
        const data = await response.json();
        countryId = data.countries[0].id;
      } catch (error) {
        console.error(`Ошибка при поиске страны ${country}:`, error);
      }
    }

    const cityId = await createCity(cityName, countryId);
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
    const cityName = cities[i].city;
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
