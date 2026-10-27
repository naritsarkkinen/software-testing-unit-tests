import express from "express";
import request from "supertest";
import dogRoutes from "../routes/dogRoutes";
import { describe, it, expect, vi } from "vitest";
import { getDogImage } from "../controllers/dogController";

const app = express();
app.use(express.json());
app.use("/api/dogs", dogRoutes);

vi.mock("../controllers/dogController", () => ({
  getDogImage: vi.fn(),
}));

describe("Dog Routes", () => {
  it("should return status 200 and dog image data", async () => {
    const mockImageUrl = "https://example.com/dog.jpg";

    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.status(200).json({
        success: true,
        data: {
          imageUrl: mockImageUrl,
          status: "success",
        },
      });
    });

    const response = await request(app).get("/api/dogs/random");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toBe(mockImageUrl);
  });

  it("should return status 500 when the controller fails", async () => {
    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.status(500).json({
        success: false,
        error: "Failed to fetch dog image: Network error",
      });
    });

    const response = await request(app).get("/api/dogs/random");
    expect(response.body.success).toBe(false);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Failed to fetch dog image: Network error",
    );
  });
});
