import { useMemo } from 'react';
import { buildSearchIndex } from '../utils/search';
import { Book, Highlight, Note } from '../types/domain';

export function useSearch(books: Book[], notes: Note[], highlights: Highlight[], keyword: string) {
  const index = useMemo(() => buildSearchIndex(books, notes, highlights), [books, notes, highlights]);
  return useMemo(() => keyword ? index.search(keyword, { enrich: true, limit: 8 }) : [], [index, keyword]);
}
