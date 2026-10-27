import { describe, it, expect, vi, afterEach } from "vitest";
import { getRandomDogImage } from "../services/dogService";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Dog Service", () => {
  it("should return mocked data", async () => {
    const mockData = {
      message: "https://example.com/image.jpg",
      status: "success",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    vi.stubGlobal("fetch", mockFetch);
    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockData.message);
    expect(result.status).toBe("success");
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("should reject when Dog API returns 500", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    vi.stubGlobal("fetch", mockFetch);

    await expect(getRandomDogImage()).rejects.toThrow(
      "Failed to fetch dog image: Dog API returned status 500",
    );
  });
});
