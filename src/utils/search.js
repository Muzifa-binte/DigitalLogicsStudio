function normalizeSearchText(value = "") {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function compactSearchText(value = "") {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

function buildFieldIndex(value = "") {
  const normalized = normalizeSearchText(value);

  return {
    normalized,
    compact: normalized.replace(/\s+/g, ""),
    words: normalized ? normalized.split(" ") : [],
  };
}

function buildSearchIndex(item) {
  const title = buildFieldIndex(item.title);
  const description = buildFieldIndex(item.description);
  const links = buildFieldIndex(item.links.map((link) => link.text).join(" "));
  const combined = buildFieldIndex(
    [item.title, item.description, ...item.links.map((link) => link.text)].join(" "),
  );

  return {
    item,
    title,
    description,
    links,
    combined,
  };
}

function tokenMatchesField(token, field) {
  return field.normalized.includes(token) || field.compact.includes(token);
}

function scoreToken(token, index) {
  let score = 0;

  if (
    index.title.words.some((word) => word.startsWith(token)) ||
    index.title.compact.startsWith(token)
  ) {
    score += 12;
  } else if (tokenMatchesField(token, index.title)) {
    score += 8;
  }

  if (
    index.links.words.some((word) => word.startsWith(token)) ||
    index.links.compact.startsWith(token)
  ) {
    score += 6;
  } else if (tokenMatchesField(token, index.links)) {
    score += 4;
  }

  if (
    index.description.words.some((word) => word.startsWith(token)) ||
    index.description.compact.startsWith(token)
  ) {
    score += 3;
  } else if (tokenMatchesField(token, index.description)) {
    score += 2;
  }

  return score;
}

function scoreIndexedItem(index, queryTokens, normalizedQuery) {
  const queryCompact = compactSearchText(normalizedQuery);

  if (normalizedQuery) {
    if (index.title.normalized.includes(normalizedQuery)) {
      return 200 + normalizedQuery.length;
    }

    if (index.combined.normalized.includes(normalizedQuery)) {
      return 120 + normalizedQuery.length;
    }

    if (queryCompact && index.combined.compact.includes(queryCompact)) {
      return 90 + queryCompact.length;
    }
  }

  return queryTokens.reduce((totalScore, token) => {
    return totalScore + scoreToken(token, index);
  }, 0);
}

function matchesIndexedItem(index, rawQuery) {
  const normalizedQuery = normalizeSearchText(rawQuery);

  if (!normalizedQuery) {
    return true;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  return queryTokens.every((token) => tokenMatchesField(token, index.combined));
}

function searchIndexedItems(indexedItems, rawQuery) {
  const normalizedQuery = normalizeSearchText(rawQuery);

  if (!normalizedQuery) {
    return indexedItems.map(({ item }) => item);
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  return indexedItems
    .filter((index) => matchesIndexedItem(index, normalizedQuery))
    .map((index) => ({
      item: index.item,
      score: scoreIndexedItem(index, queryTokens, normalizedQuery),
    }))
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => item);
}

export {
  buildSearchIndex,
  matchesIndexedItem,
  normalizeSearchText,
  searchIndexedItems,
};
