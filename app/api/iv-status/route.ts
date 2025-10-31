import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// === Types ===
interface IVData {
  Post: string;
  "Visa Category": string;
  "Case Documentarily Complete": string;
}

interface CountryOption {
  country: string;
  embassies: IVData[];
  consulates: IVData[];
}

interface SimilarCountry {
  country: string;
  posts: IVData[];
}

// === Helper Functions ===

// Extract country from post (e.g., "Lagos, Nigeria" → "Nigeria")
function extractCountry(post: string): string | null {
  const parts = post.split(/[,\/]/);
  if (parts.length >= 2) {
    return parts[parts.length - 1].trim();
  }
  return null;
}

// Detect if post is Embassy or Consulate
function detectPostType(post: string): "Embassy" | "Consulate" {
  return post.toLowerCase().includes("consulate") ? "Consulate" : "Embassy";
}

// Levenshtein distance for string similarity
function getEditDistance(a: string, b: string): number {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  const costs: number[] = Array(shorter.length + 1).fill(0);

  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(newValue, lastValue, costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return costs[shorter.length];
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const distance = getEditDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Group posts by country
function groupByCountry(data: IVData[]): Map<string, IVData[]> {
  const countryMap = new Map<string, IVData[]>();

  data.forEach((item) => {
    const country = extractCountry(item.Post);
    if (country) {
      if (!countryMap.has(country)) {
        countryMap.set(country, []);
      }
      countryMap.get(country)!.push(item);
    }
  });

  return countryMap;
}

// Find top 3 similar countries
function findSimilarCountries(
  searchTerm: string,
  countryMap: Map<string, IVData[]>
): SimilarCountry[] {
  return Array.from(countryMap.entries())
    .map(([country, posts]) => ({
      country,
      similarity: calculateSimilarity(searchTerm, country),
      posts,
    }))
    .filter((s) => s.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map((s) => ({ country: s.country, posts: s.posts }));
}

// === API Route ===
export async function POST(req: Request) {
  try {
    const { city, visaCategory } = await req.json();

    console.log("API Request received:", { city, visaCategory });

    if (!city?.trim() || !visaCategory) {
      return NextResponse.json(
        { error: "City and visa category are required" },
        { status: 400 }
      );
    }

    // Load data
    const jsonPath = path.join(process.cwd(), "backend", "data", "iv_data.json");
    console.log("Looking for file at:", jsonPath);

    if (!fs.existsSync(jsonPath)) {
      console.error("Data file not found at", jsonPath);
      return NextResponse.json(
        { error: "Data file not found. Please run the scraper first." },
        { status: 500 }
      );
    }

    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    const allData: IVData[] = JSON.parse(fileContent);

    console.log(`Loaded ${allData.length} total records`);

    // Map visa categories
    const categoryMap: Record<string, string> = {
      "immediate-relative": "Immediate Relative",
      "family-sponsored": "Family-Sponsored Preference",
      "employment-based": "Employment-Based Preference",
    };

    const categoryName = categoryMap[visaCategory] || visaCategory;
    console.log(`Searching for: city="${city}", category="${categoryName}"`);

    // Exact match filter
    const filtered = allData.filter((item) => {
      const postMatch = item.Post.toLowerCase().includes(city.toLowerCase());
      const categoryMatch = item["Visa Category"]
        .toLowerCase()
        .includes(categoryName.toLowerCase());

      return postMatch && categoryMatch;
    });

    console.log(`Found ${filtered.length} matching records`);

    // Return exact matches
    if (filtered.length > 0) {
      return NextResponse.json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    // No exact match → suggest similar countries
    console.log("No exact match. Searching similar countries...");
    const countryMap = groupByCountry(allData);
    const similarCountries = findSimilarCountries(city, countryMap);

    if (similarCountries.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No results found for "${city}". Try a different search term.`,
        data: [],
      });
    }

    console.log("Similar countries:", similarCountries.map((c) => c.country));

    // Group by Embassy/Consulate per country
    const countryOptions: CountryOption[] = similarCountries.map((item) => {
      const embassies = item.posts.filter(
        (p) =>
          detectPostType(p.Post) === "Embassy" &&
          p["Visa Category"].toLowerCase().includes(categoryName.toLowerCase())
      );

      const consulates = item.posts.filter(
        (p) =>
          detectPostType(p.Post) === "Consulate" &&
          p["Visa Category"].toLowerCase().includes(categoryName.toLowerCase())
      );

      return {
        country: item.country,
        embassies,
        consulates,
      };
    });

    return NextResponse.json({
      success: false,
      message: `We couldn't find "${city}". Did you mean one of these countries?`,
      needsCountrySelection: true,
      countryOptions,
      searchTerm: city,
      data: [],
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}