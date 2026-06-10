import Database from 'better-sqlite3';
import { app } from 'electron';
import { join } from 'node:path';
import { schemaSql } from './schema.js';

const dbPath = join(app.getPath('userData'), 'reading-notes.db');
const db = new Database(dbPath);
db.exec(schemaSql);

export const repository = {
  listBooks() {
    return db.prepare('SELECT * FROM books ORDER BY id DESC').all();
  },
  createBook(book: Record<string, unknown>) {
    const stmt = db.prepare('INSERT INTO books(title, author, publisher, isbn, cover, tags, status) VALUES(@title, @author, @publisher, @isbn, @cover, @tags, @status)');
    return stmt.run({ ...book, tags: JSON.stringify(book.tags ?? []), status: book.status ?? 'want' });
  },
  listNotes() {
    return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
  },
  saveNote(note: Record<string, unknown>) {
    return db.prepare('INSERT INTO notes(book_id, title, markdown, tags, updated_at) VALUES(@bookId, @title, @markdown, @tags, @updatedAt)').run({ ...note, tags: JSON.stringify(note.tags ?? []), updatedAt: new Date().toISOString() });
  },
  listHighlights() {
    return db.prepare('SELECT * FROM highlights ORDER BY id DESC').all();
  },
  createHighlight(highlight: Record<string, unknown>) {
    return db.prepare('INSERT INTO highlights(book_id, page, quote, annotation) VALUES(@bookId, @page, @quote, @annotation)').run(highlight);
  },
};
