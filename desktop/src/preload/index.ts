import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('readingApi', {
  listBooks: () => ipcRenderer.invoke('books:list'),
  createBook: (book: unknown) => ipcRenderer.invoke('books:create', book),
  updateBook: (book: unknown) => ipcRenderer.invoke('books:update', book),
  deleteBook: (id: number) => ipcRenderer.invoke('books:delete', id),
  listNotes: () => ipcRenderer.invoke('notes:list'),
  saveNote: (note: unknown) => ipcRenderer.invoke('notes:save', note),
  listHighlights: () => ipcRenderer.invoke('highlights:list'),
  createHighlight: (highlight: unknown) => ipcRenderer.invoke('highlights:create', highlight),
});
