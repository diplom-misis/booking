import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  roots: ["<rootDir>/src/__tests__"],
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
