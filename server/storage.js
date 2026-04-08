import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');

function readDB() {
  if (!existsSync(DB_PATH)) return { quotes: [] };
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { quotes: [] };
  }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function saveQuote(quote) {
  const db = readDB();
  db.quotes.push(quote);
  writeDB(db);
}

export function getAllQuotes() {
  return readDB().quotes;
}

export function getRanking(category = null) {
  const { quotes } = readDB();
  const filtered = category ? quotes.filter(q => q.category === category) : quotes;
  return filtered
    .sort((a, b) => b.score - a.score || new Date(a.created_at) - new Date(b.created_at))
    .map((q, i) => ({ ...q, rank: i + 1 }));
}

export function calculateRanks(quote) {
  const { quotes } = readDB();
  const allSorted = [...quotes].sort((a, b) => b.score - a.score || new Date(a.created_at) - new Date(b.created_at));
  const catSorted = allSorted.filter(q => q.category === quote.category);

  const rank = allSorted.findIndex(q => q.id === quote.id) + 1;
  const category_rank = catSorted.findIndex(q => q.id === quote.id) + 1;
  return { rank, category_rank };
}
