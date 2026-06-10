import { create } from 'zustand';
import { Book, Highlight, Note } from '../types/domain';

type LibraryState = {
  books: Book[];
  notes: Note[];
  highlights: Highlight[];
  theme: 'light' | 'dark';
  load: () => Promise<void>;
  toggleTheme: () => void;
  addSampleData: () => Promise<void>;
};

export const useLibraryStore = create<LibraryState>((set, get) => ({
  books: [],
  notes: [],
  highlights: [],
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  async load() {
    const [books, notes, highlights] = await Promise.all([window.readingApi.listBooks(), window.readingApi.listNotes(), window.readingApi.listHighlights()]);
    set({ books, notes, highlights });
  },
  toggleTheme() {
    const theme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  async addSampleData() {
    await window.readingApi.createBook({ title: '人类群星闪耀时', author: '斯蒂芬·茨威格', publisher: '生活读书新知三联书店', isbn: '9787108062437', tags: ['文学/传记'], status: 'reading', progress: 42 });
    await window.readingApi.saveNote({ bookId: 1, title: '历史片段笔记', markdown: '## 摘要\n命运常在短时间内压缩成决定性瞬间。', tags: ['历史'] });
    await window.readingApi.createHighlight({ bookId: 1, page: 32, quote: '一个真正具有世界历史意义的时刻。', annotation: '可作为开篇摘录。' });
    await get().load();
  },
}));
