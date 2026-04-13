import request from "supertest";
import { beforeAll, describe, it, expect, vi } from "vitest";
import { createApp } from "../src/app.js";
import logger from "../src/logger.js";

beforeAll(() => {
  logger.level = "silent";
});

describe("API", () => {
  it("GET /health -> 200 ok without checking DB", async () => {
    const pool = { query: vi.fn() };
    const app = createApp({ pool });

    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", service: "api" });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("GET /health/db -> 200 ok when DB answers", async () => {
    const pool = { query: vi.fn().mockResolvedValue({ rows: [] }) };
    const app = createApp({ pool });

    const res = await request(app).get("/health/db");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      service: "api",
      database: "up",
    });
    expect(pool.query).toHaveBeenCalledWith("SELECT 1");
  });

  it("GET /health/db -> 503 when DB is unavailable", async () => {
    const pool = { query: vi.fn().mockRejectedValue(new Error("db down")) };
    const app = createApp({ pool });

    const res = await request(app).get("/health/db");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({
      status: "error",
      service: "api",
      database: "down",
    });
    expect(pool.query).toHaveBeenCalledWith("SELECT 1");
  });

  it("POST /notes without title -> 400", async () => {
    const pool = { query: vi.fn() }; // ne doit même pas être appelé
    const app = createApp({ pool });

    const res = await request(app).post("/notes").send({ content: "yo" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "title is required" });
    expect(pool.query).not.toHaveBeenCalled();
  });
});
