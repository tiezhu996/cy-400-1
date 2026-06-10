export type ReadingStatus = 'read' | 'reading' | 'want';
export type Book = { id?: number; title: string; author: string; publisher?: string; isbn?: string; cover?: string; tags: string[]; status: ReadingStatus; progress?: number; reading_minutes?: number };
export type Note = { id?: number; bookId: number; title: string; markdown: string; tags: string[]; updatedAt?: string };
export type Highlight = { id?: number; bookId: number; page?: number; quote: string; annotation?: string };

declare global {
  interface Window {
    readingApi: {
      listBooks(): Promise<Book[]>;
      createBook(book: Book): Promise<unknown>;
      listNotes(): Promise<Note[]>;
      saveNote(note: Note): Promise<unknown>;
      listHighlights(): Promise<Highlight[]>;
      createHighlight(highlight: Highlight): Promise<unknown>;
    };
  }
}
