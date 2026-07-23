import { describe, expect, it, vi, beforeEach } from "vitest";

import { serverKnowledgeRetriever } from "@/lib/ai/server-knowledge-retriever";
import type { KnowledgeArticle } from "@/types/knowledge-article";

let searchResults: Array<Pick<KnowledgeArticle, "id" | "title" | "content" | "category" | "language" | "priority"> & { score?: number }> = [];

vi.mock("@/lib/services/knowledge.service", () => ({
  searchPublishedKnowledgeForHotel: vi.fn(async () => searchResults),
  searchKnowledgeArticlesForHotel: vi.fn(async () => searchResults),
}));

function article(
  overrides: Partial<KnowledgeArticle> & { id: string }
): Pick<KnowledgeArticle, "id" | "title" | "content" | "category" | "language" | "priority"> {
  return {
    title: "Check-in time",
    content: "Check-in is from 14:00.",
    category: "policies",
    language: "en",
    priority: 0,
    ...overrides,
  } as Pick<KnowledgeArticle, "id" | "title" | "content" | "category" | "language" | "priority">;
}

describe("serverKnowledgeRetriever", () => {
  beforeEach(() => {
    searchResults = [];
  });

  it("prefers articles matching the detected language when a match exists", async () => {
    searchResults = [
      article({ id: "en-1", language: "en" }),
      article({ id: "ru-1", language: "ru" }),
    ];

    const result = await serverKnowledgeRetriever.retrieve({
      hotelId: "hotel_test",
      query: "check-in time",
      language: "ru",
    });

    expect(result.map((r) => r.id)).toEqual(["ru-1"]);
  });

  it("regression: falls back to any-language results instead of returning nothing when the detected language has no matching articles", async () => {
    // This is the bug found during the multilingual audit: a guest writing
    // in Arabic, Chinese, Japanese, Hindi, or Korean gets detectLanguage's
    // default fallback ("ru") because none of those scripts are covered by
    // the 9 supported languages. Before this fix, that meant the guest got
    // zero knowledge base results whenever the hotel's articles were
    // tagged in any language other than Russian — even though a directly
    // relevant article existed, just tagged "en".
    searchResults = [article({ id: "en-1", language: "en" })];

    const result = await serverKnowledgeRetriever.retrieve({
      hotelId: "hotel_test",
      query: "check-in time",
      language: "ru", // misdetected — guest actually wrote in Arabic
    });

    expect(result.map((r) => r.id)).toEqual(["en-1"]);
  });

  it("returns nothing when there genuinely are no matching articles at all, in any language", async () => {
    searchResults = [];

    const result = await serverKnowledgeRetriever.retrieve({
      hotelId: "hotel_test",
      query: "does not exist",
      language: "ru",
    });

    expect(result).toEqual([]);
  });

  it("still applies the category filter even when falling back across languages", async () => {
    searchResults = [
      article({ id: "en-wrong-category", language: "en", category: "amenities" }),
    ];

    const result = await serverKnowledgeRetriever.retrieve({
      hotelId: "hotel_test",
      query: "check-in time",
      language: "ru",
      category: "policies",
    });

    expect(result).toEqual([]);
  });

  it("respects the limit after falling back to unfiltered-by-language results", async () => {
    searchResults = [
      article({ id: "en-1" }),
      article({ id: "en-2" }),
      article({ id: "en-3" }),
    ];

    const result = await serverKnowledgeRetriever.retrieve({
      hotelId: "hotel_test",
      query: "check-in time",
      language: "ru",
      limit: 2,
    });

    expect(result).toHaveLength(2);
  });
});
