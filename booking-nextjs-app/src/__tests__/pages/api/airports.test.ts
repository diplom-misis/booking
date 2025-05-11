import { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/airport";
import prisma from "@/utils/prisma";
import { createMocks } from "node-mocks-http";

jest.mock("@/utils/prisma", () => ({
  airport: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  city: {
    findUnique: jest.fn(),
  },
}));

describe("Airports API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/airports", () => {
    it("should return all airports when no cityId is provided", async () => {
      const mockAirports = [
        { id: "1", name: "Airport 1", code: "AP1", cityId: "1" },
        { id: "2", name: "Airport 2", code: "AP2", cityId: "2" },
      ];
      (prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports);

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        airports: mockAirports,
      });
    });

    it("should return airports filtered by cityId when provided", async () => {
      const mockAirports = [
        { id: "1", name: "Airport 1", code: "AP1", cityId: "1" },
      ];
      (prisma.airport.findMany as jest.Mock).mockResolvedValue(mockAirports);

      const { req, res } = createMocks({
        method: "GET",
        query: {
          cityId: "1",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        airports: mockAirports,
      });
      expect(prisma.airport.findMany).toHaveBeenCalledWith({
        where: { cityId: "1" },
      });
    });
  });

  describe("POST /api/airports", () => {
    it("should create a new airport with valid data", async () => {
      const mockAirport = {
        id: "1",
        name: "New Airport",
        code: "NAP",
        cityId: "1",
      };
      const mockCity = { id: "1", name: "New City" };

      (prisma.city.findUnique as jest.Mock).mockResolvedValue(mockCity);
      (prisma.airport.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.airport.create as jest.Mock).mockResolvedValue(mockAirport);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "New Airport",
          code: "NAP",
          cityId: "1",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Airport created successfully",
        airport: mockAirport,
      });
    });

    it("should return 400 for validation errors", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "A",
          code: "NA",
          cityId: "",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(400);
      const response = JSON.parse(res._getData());
      expect(response.message).toBe("Validation failed");
      expect(response.errors).toHaveLength(3);
    });

    it("should return 400 if city does not exist", async () => {
      (prisma.city.findUnique as jest.Mock).mockResolvedValue(null);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "New Airport",
          code: "NAP",
          cityId: "999",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Specified city does not exist",
      });
    });

    it("should return 409 if airport with same code already exists", async () => {
      const mockCity = { id: "1", name: "New City" };
      const mockExistingAirport = {
        id: "1",
        name: "Existing Airport",
        code: "NAP",
        cityId: "1",
      };

      (prisma.city.findUnique as jest.Mock).mockResolvedValue(mockCity);
      (prisma.airport.findFirst as jest.Mock).mockResolvedValue(
        mockExistingAirport,
      );

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "New Airport",
          code: "NAP",
          cityId: "1",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(409);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Airport with this name already exists",
      });
    });

    it("should return 405 for unsupported HTTP methods", async () => {
      const { req, res } = createMocks({
        method: "PUT",
      });
  
      await handler(req as NextApiRequest, res as NextApiResponse);
  
      expect(res.statusCode).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Method not allowed",
      });
    });
  });
});
