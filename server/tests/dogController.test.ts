import { describe, it, expect, vi } from "vitest";
import { getDogImage } from "../controllers/dogController";
import { getRandomDogImage } from "../services/dogService";
import type { Request, Response } from "express";

vi.mock("../services/dogService", () => ({
  getRandomDogImage: vi.fn(),
}));

const mockDogData = {
  imageUrl: "https://example.com/dog.jpg",
  status: "success",
};

const jsonMock = vi.fn();

const res = {
  json: jsonMock,
} as unknown as Response;

const req = {} as Request;

describe("Dog Controller", () => {
  it("should return success and mocked dog data", async () => {
    vi.mocked(getRandomDogImage).mockResolvedValue(mockDogData);
    await getDogImage(req, res);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: mockDogData,
    });
  });
});
