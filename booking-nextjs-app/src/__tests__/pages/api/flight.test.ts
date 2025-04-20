import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/flight";
import { TicketClass, PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mockPrisma = {
    airport: {
      findMany: jest.fn(),
    },
    flight: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    TicketClass: {
      ECONOMY: "ECONOMY",
      BUSINESS: "BUSINESS",
      FIRST: "FIRST",
    },
  };
});

const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

const mockAirports = [
  { id: "1", code: "VKO" },
  { id: "2", code: "GOJ" },
  { id: "3", code: "CSY" },
];

const validFlightData = {
  departureAirport: "vko",
  departureDateTime: "2025-01-01T10:00:00Z",
  arrivalAirport: "goj",
  arrivalDateTime: "2025-01-01T14:00:00Z",
  company: "Pobeda",
  flightNumber: "DP742",
  ticketClass: TicketClass.ECONOMY,
  price: 299.99,
};

describe("/api/flights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.flight.findMany as jest.Mock).mockReset();
    (prisma.flight.createMany as jest.Mock).mockReset();
  });

  it("should reject non-POST methods", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({
      message: "Method Not Allowed",
    });
  });

  it("should validate request body structure", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { wrongKey: [validFlightData] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData().message).toBe("Invalid request data");
  });

  it("should validate flight data fields", async () => {
    const invalidFlight = {
      ...validFlightData,
      departureAirport: "VK", // нужно 3 символа
      price: -100, // подарок за покупку билетов не предусмотрено ;)
    };

    const { req, res } = createMocks({
      method: "POST",
      body: { data: [invalidFlight] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const response = res._getJSONData();
    expect(response.message).toBe("Invalid request data");
    expect(response.errors.fieldErrors).toEqual({
      data: [
        "String must contain at least 3 character(s)",
        "Number must be greater than 0",
      ],
    });
  });

  it("should check for unknown airport codes", async () => {
    (prisma.airport.findMany as jest.Mock).mockResolvedValue([mockAirports[0]]);

    const { req, res } = createMocks({
      method: "POST",
      body: {
        data: [
          {
            ...validFlightData,
            departureAirport: "VKO",
            arrivalAirport: "XXX",
          },
        ],
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: "Unknown airport codes",
      missingCodes: ["XXX"],
    });
  });

  it("should create flights with valid data", async () => {
    (prisma.airport.findMany as jest.Mock).mockResolvedValue(
      mockAirports.slice(0, 2),
    );
    (prisma.flight.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.flight.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    const { req, res } = createMocks({
      method: "POST",
      body: {
        data: [
          {
            ...validFlightData,
            // в ходе валидации должен превратиться в верхний регистр
            departureAirport: "vko",
            arrivalAirport: "goj",
          },
        ],
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toEqual({
      message: "Flights created successfully",
      duplicatesIgnored: 0,
      count: 1,
    });
    expect(res._getStatusCode()).toBe(201);

    expect(prisma.airport.findMany).toHaveBeenCalledWith({
      where: { code: { in: ["VKO", "GOJ"] } },
    });

    expect(prisma.flight.createMany).toHaveBeenCalledWith({
      data: [
        {
          fromAirportId: "1", // VKO
          fromDatetime: new Date("2025-01-01T10:00:00Z"),
          toAirportId: "2", // GOJ
          toDatetime: new Date("2025-01-01T14:00:00Z"),
          company: "Pobeda",
          flightNumber: "DP742",
          ticketClass: TicketClass.ECONOMY,
          price: 299.99,
        },
      ],
    });
  });

  it("should ignore duplicate flights", async () => {
    (prisma.airport.findMany as jest.Mock).mockResolvedValue(
      mockAirports.slice(0, 2),
    );
    (prisma.flight.findMany as jest.Mock).mockResolvedValue([
      {
        fromAirportId: "1",
        toAirportId: "2",
        fromDatetime: new Date("2025-01-01T10:00:00Z"),
        toDatetime: new Date("2025-01-01T14:00:00Z"),
        company: "Pobeda",
        flightNumber: "DP742",
        ticketClass: TicketClass.ECONOMY,
      },
    ]);
    (prisma.flight.createMany as jest.Mock).mockResolvedValue({ count: 1 });

    const duplicateFlight = {
      ...validFlightData,
      departureAirport: "vko",
      arrivalAirport: "goj",
    };

    const uniqueFlight = {
      ...validFlightData,
      departureDateTime: "2025-01-02T10:00:00Z",
      arrivalDateTime: "2025-01-02T14:00:00Z",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: {
        data: [duplicateFlight, uniqueFlight],
      },
    });

    await handler(req, res);

    expect(res._getJSONData()).toEqual({
      message:
        "Flights created successfully. 1 duplicate flights were ignored.",
      count: 1,
      duplicatesIgnored: 1,
    });
    expect(res._getStatusCode()).toBe(201);

    expect(prisma.flight.createMany).toHaveBeenCalledWith({
      data: [
        {
          fromAirportId: "1",
          fromDatetime: new Date("2025-01-02T10:00:00Z"),
          toAirportId: "2",
          toDatetime: new Date("2025-01-02T14:00:00Z"),
          company: "Pobeda",
          flightNumber: "DP742",
          ticketClass: TicketClass.ECONOMY,
          price: 299.99,
        },
      ],
    });
  });

  it("should handle server errors", async () => {
    (prisma.airport.findMany as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const { req, res } = createMocks({
      method: "POST",
      body: {
        data: [validFlightData],
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Internal Server Error",
    });
  });
});
