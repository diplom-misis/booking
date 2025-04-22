import { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/auth/signup";
import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { createMocks } from "node-mocks-http";

jest.mock("@/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hashSync: jest.fn(),
}));

describe("POST /api/auth/signup", () => {
  it("should return 400 if validation fails", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        firstName: "John",
        lastName: "",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({ error: "Фамилия слишком короткая" }),
    );
  });

  it("should return 409 if the user already exists", async () => {
    const existingUser = {
      id: "1",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "hashedPassword",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    const { req, res } = createMocks({
      method: "POST",
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.statusCode).toBe(409);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({ error: "Пользователь уже существует" }),
    );
  });

  it("should create a user and return 200 if successful", async () => {
    const hashedPassword = "hashedPassword";
    (bcrypt.hashSync as jest.Mock).mockReturnValue(hashedPassword);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "1",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      password: hashedPassword,
    });

    const { req, res } = createMocks({
      method: "POST",
      body: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      },
    });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: "1",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      }),
    );
  });
});
