import { buildSearchIndex, searchIndexedItems } from "./utils/search";

const sampleItems = [
  {
    title: "Advanced Security Scanner",
    description: "Scan applications for vulnerabilities",
    links: [{ text: "Open Security Scanner", to: "/security" }],
  },
  {
    title: "Penetration Testing Tool",
    description: "Hands-on testing workflows",
    links: [{ text: "Start Testing", to: "/testing" }],
  },
  {
    title: "Backend Scan Engine",
    description: "Fast engine for smart scans",
    links: [{ text: "Run Scan", to: "/scan" }],
  },
];

const indexedItems = sampleItems.map((item) => buildSearchIndex(item));

test("matches case-insensitive and partial search fragments", () => {
  const results = searchIndexedItems(indexedItems, "SECUR");

  expect(results).toHaveLength(1);
  expect(results[0].title).toBe("Advanced Security Scanner");
});

test("matches tokens from the middle and end of the text", () => {
  const results = searchIndexedItems(indexedItems, "testing");

  expect(results).toHaveLength(1);
  expect(results[0].title).toBe("Penetration Testing Tool");
});

test("matches multiple keyword fragments across the indexed content", () => {
  const results = searchIndexedItems(indexedItems, "backend scan");

  expect(results).toHaveLength(1);
  expect(results[0].title).toBe("Backend Scan Engine");
});
