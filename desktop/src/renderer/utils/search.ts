import FlexSearch from 'flexsearch';
import { Book, Highlight, Note } from '../types/domain';

export function buildSearchIndex(books: Book[], notes: Note[], highlights: Highlight[]) {
  const index = new FlexSearch.Document({ document: { id: 'id', index: ['title', 'body'], store: true } });
  books.forEach((book) => index.add({ id: `book-${book.id}`, title: book.title, body: `${book.author} ${(book.tags ?? []).join(' ')}` }));
  notes.forEach((note) => index.add({ id: `note-${note.id}`, title: note.title, body: note.markdown }));
  highlights.forEach((item) => index.add({ id: `highlight-${item.id}`, title: item.quote.slice(0, 24), body: `${item.quote} ${item.annotation ?? ''}` }));
  return index;
}
