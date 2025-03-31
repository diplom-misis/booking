const transfers = [
  { id: 1, station: 'Белогорье', duration: '2 часа' },
  { id: 2, station: 'Белогорье', duration: '2 часа' },
];

export const routesThere = [
  {
    id: 1,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: transfers,
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 10000
  },
  {
    id: 2,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: [transfers[0]],
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 5000
  },
  {
    id: 3,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: [],
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 2500
  },
]

export const routesBack = [
  {
    id: 4,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: transfers,
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 12000
  },
  {
    id: 5,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: [transfers[0]],
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 6000
  },
  {
    id: 6,
    airlines: ["«Золотая стрела»"],
    dateOut: "3 декабря",
    timeOut: "08:00",
    dateIn: "3 декабря",
    timeIn: "14:30",
    totalTime: "4 ч. 30 мин.",
    transfers: [],
    cityFrom: 'Лукоморье',
    cityTo: 'Тридевятье',
    totalPrice: 3000
  },
]