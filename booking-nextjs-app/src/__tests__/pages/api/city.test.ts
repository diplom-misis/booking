import { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/city";
import prisma from "@/utils/prisma";
import { createMocks } from "node-mocks-http";

jest.mock("@/utils/prisma", () => ({
  city: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  country: {
    findUnique: jest.fn(),
  },
}));

describe("Cities API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/cities", () => {
    it("should return all cities when no search query is provided", async () => {
      const mockCities = [
        { id: "1", name: "New York", countryId: "3b241101-e2bb-4255-8caf-4136a566f21c" },
        { id: "2", name: "London", countryId: "4b241101-e2bb-4255-8caf-4136a566f21c" },
      ];
      (prisma.city.findMany as jest.Mock).mockResolvedValue(mockCities);

      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        cities: mockCities,
      });
      expect(prisma.city.findMany).toHaveBeenCalledWith({
        where: {},
      });
    });

    it("should return filtered cities when search query is provided", async () => {
      const mockCities = [{ id: "1", name: "New York", countryId: "3b241101-e2bb-4255-8caf-4136a566f21c" }];
      (prisma.city.findMany as jest.Mock).mockResolvedValue(mockCities);

      const { req, res } = createMocks({
        method: "GET",
        query: {
          search: "new",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        cities: mockCities,
      });
      expect(prisma.city.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: "new" } },
            { name: { contains: "new" } },
            { name: { contains: "NEW" } },
            { name: { contains: "New" } },
          ],
        },
      });
    });

    it("should return 400 for invalid query parameters", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          search: 123 as any,
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        message: "Invalid query parameters",
        errors: expect.arrayContaining([
          expect.objectContaining({
            code: "invalid_type",
          }),
        ]),
      });
    });
  });

  describe("POST /api/cities", () => {
    it("should create a new city with valid data", async () => {
      const mockCity = {
        id: "1",
        name: "Paris",
        countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
      };

      (prisma.country.findUnique as jest.Mock).mockResolvedValue({ id: mockCity.countryId });
      (prisma.city.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.city.create as jest.Mock).mockResolvedValue(mockCity);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Paris",
          countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "City created successfully",
        city: mockCity,
      });
    });

    it("should return 400 for validation errors", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "P",
          countryId: "not-a-uuid",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(400);
      const response = JSON.parse(res._getData());
      expect(response.message).toBe("Validation failed");
      expect(response.errors).toHaveLength(2);
      expect(response.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "City name must be at least 2 characters",
          }),
          expect.objectContaining({
            message: "countryId must be uuid",
          }),
        ]),
      );
    });

    it("should return 409 if city with same name and country already exists", async () => {
      const existingCity = {
        id: "1",
        name: "Berlin",
        countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
      };

      (prisma.country.findUnique as jest.Mock).mockResolvedValue({ id: existingCity.countryId });
      (prisma.city.findFirst as jest.Mock).mockResolvedValue(existingCity);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Berlin",
          countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(409);
      expect(JSON.parse(res._getData())).toEqual({
        message: "City with this name already exists",
      });
    });

    it("should allow cities with same name in different countries", async () => {
      const mockCity = {
        id: "2",
        name: "Springfield",
        countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
      };
      const existingCityDifferentCountry = {
        id: "1",
        name: "Springfield",
        countryId: "6b241101-e2bb-4255-8caf-4136a566f21c",
      };

      (prisma.country.findUnique as jest.Mock).mockResolvedValue({ id: mockCity.countryId });
      (prisma.city.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.city.create as jest.Mock).mockResolvedValue(mockCity);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          name: "Springfield",
          countryId: "3b241101-e2bb-4255-8caf-4136a566f21c",
        },
      });

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: "City created successfully",
        city: mockCity,
      });
    });
  });

  it("should return 405 for unsupported HTTP methods", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.statusCode).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: "Method Not Allowed",
    });
  });
});