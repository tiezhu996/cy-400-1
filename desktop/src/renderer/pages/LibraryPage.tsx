import { useEffect, useState, type FormEvent } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useLibraryStore } from '../stores/libraryStore';
import { SearchBar } from '../components/SearchBar';
import { TagTree } from '../components/TagTree';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { useSearch } from '../hooks/useSearch';
import type { Book, ReadingStatus } from '../types/domain';

function getRemainingDays(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

function deadlineClass(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return 'bg-red-100 border-red-400 text-red-800';
  if (days <= 3) return 'bg-amber-100 border-amber-400 text-amber-800';
  if (days <= 7) return 'bg-yellow-50 border-yellow-300 text-yellow-800';
  return '';
}

function deadlineLabel(days: number | null): string {
  if (days === null) return '';
  if (days < 0) return `已逾期 ${Math.abs(days)} 天`;
  if (days === 0) return '今天到期';
  return `剩余 ${days} 天`;
}

const STATUS_LABELS: Record<ReadingStatus, string> = { want: '想读', reading: '在读', read: '已读' };

function BookCard({ book, onEdit, onDelete }: { book: Book; onEdit: () => void; onDelete: () => void }) {
  const remaining = getRemainingDays(book.plannedEndDate);
  const progress = book.progress ?? 0;
  const alertClass = deadlineClass(remaining);

  return (
    <section className={`rounded border p-3 transition-colors ${alertClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <b className="block truncate">{book.title}</b>
          <p className="text-sm text-gray-600">{book.author} · {STATUS_LABELS[book.status]}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200" onClick={onEdit}>编辑</button>
          <button className="rounded bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100" onClick={onDelete}>删除</button>
        </div>
      </div>

      {book.status !== 'want' && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span>进度 {progress}%</span>
            {remaining !== null && <span className={`font-medium ${remaining < 0 ? 'text-red-600' : remaining <= 3 ? 'text-amber-700' : ''}`}>{deadlineLabel(remaining)}</span>}
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-emerald-500' : remaining !== null && remaining <= 3 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>
      )}

      {remaining !== null && remaining < 0 && (
        <p className="mt-2 text-xs font-semibold text-red-600">⚠ 此书已超过计划完成日期</p>
      )}
    </section>
  );
}

const EMPTY_BOOK: Omit<Book, 'id'> = { title: '', author: '', tags: [], status: 'want', progress: 0, plannedEndDate: '' };

function BookForm({ initial, onSubmit, onCancel }: { initial: Book; onSubmit: (book: Book) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Book>({ ...EMPTY_BOOK, ...initial });

  return (
    <form className="space-y-3 rounded border bg-white p-4 text-gray-900 shadow-sm" onSubmit={(e: FormEvent) => { e.preventDefault(); onSubmit(form); }}>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm"><span className="text-gray-600">书名</span><input className="mt-1 w-full rounded border px-2 py-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
        <label className="block text-sm"><span className="text-gray-600">作者</span><input className="mt-1 w-full rounded border px-2 py-1" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm"><span className="text-gray-600">出版社</span><input className="mt-1 w-full rounded border px-2 py-1" value={form.publisher ?? ''} onChange={(e) => setForm({ ...form, publisher: e.target.value })} /></label>
        <label className="block text-sm"><span className="text-gray-600">ISBN</span><input className="mt-1 w-full rounded border px-2 py-1" value={form.isbn ?? ''} onChange={(e) => setForm({ ...form, isbn: e.target.value })} /></label>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className="block text-sm"><span className="text-gray-600">状态</span><select className="mt-1 w-full rounded border px-2 py-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ReadingStatus })}><option value="want">想读</option><option value="reading">在读</option><option value="read">已读</option></select></label>
        <label className="block text-sm"><span className="text-gray-600">进度 %</span><input type="number" min={0} max={100} className="mt-1 w-full rounded border px-2 py-1" value={form.progress ?? 0} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} /></label>
        <label className="block text-sm"><span className="text-gray-600">计划读完</span><input type="date" className="mt-1 w-full rounded border px-2 py-1" value={form.plannedEndDate ?? ''} onChange={(e) => setForm({ ...form, plannedEndDate: e.target.value })} /></label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="rounded border px-3 py-1" onClick={onCancel}>取消</button>
        <button type="submit" className="rounded bg-emerald-600 px-3 py-1 text-white">保存</button>
      </div>
    </form>
  );
}

export function LibraryPage() {
  const { books, notes, highlights, theme, load, toggleTheme, addSampleData, updateBook, deleteBook } = useLibraryStore();
  const [keyword, setKeyword] = useState('');
  const [draft, setDraft] = useState('## 今日笔记\n');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const results = useSearch(books, notes, highlights, keyword);
  useEffect(() => { void load(); }, [load]);

  const handleSave = async (book: Book) => {
    if (book.id) {
      await updateBook(book);
    } else {
      await window.readingApi.createBook(book);
      await load();
    }
    setEditingBook(null);
    setShowAddForm(false);
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
  };

  return (
    <main className={theme === 'dark' ? 'dark min-h-screen p-6' : 'min-h-screen bg-gray-50 p-6 text-gray-900'}>
      <header className="mb-5 flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold">读书笔记</h1><p className="text-sm text-gray-500">本地书库、笔记、摘录和全文搜索</p></div>
        <div className="flex gap-2">
          <button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => { setShowAddForm(true); setEditingBook(null); }}>添加书籍</button>
          <button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => void addSampleData()}>示例数据</button>
          <button className="rounded border px-3 py-2" onClick={toggleTheme}>切换主题</button>
        </div>
      </header>

      {(showAddForm || editingBook) && (
        <div className="mb-4">
          <BookForm initial={editingBook ?? { ...EMPTY_BOOK }} onSubmit={(book) => void handleSave(book)} onCancel={() => { setEditingBook(null); setShowAddForm(false); }} />
        </div>
      )}

      <SearchBar value={keyword} onChange={setKeyword} />
      <div className="mt-5 grid grid-cols-[240px_1fr] gap-5">
        <aside className="space-y-4"><h2 className="font-medium">标签树</h2><TagTree /></aside>
        <Tabs.Root defaultValue="books" className="rounded border bg-white p-4 text-gray-900">
          <Tabs.List className="mb-4 flex gap-2"><Tabs.Trigger value="books">书籍</Tabs.Trigger><Tabs.Trigger value="notes">笔记</Tabs.Trigger><Tabs.Trigger value="highlights">摘录</Tabs.Trigger><Tabs.Trigger value="stats">统计</Tabs.Trigger></Tabs.List>
          <Tabs.Content value="books" className="grid gap-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onEdit={() => { setEditingBook(book); setShowAddForm(false); }} onDelete={() => void handleDelete(book.id!)} />
            ))}
          </Tabs.Content>
          <Tabs.Content value="notes"><MarkdownEditor value={draft} onChange={setDraft} /><div className="mt-4 space-y-2">{notes.map((note) => <article key={note.id} className="rounded border p-3"><b>{note.title}</b><pre className="whitespace-pre-wrap text-sm">{note.markdown}</pre></article>)}</div></Tabs.Content>
          <Tabs.Content value="highlights" className="space-y-2">{highlights.map((item) => <blockquote key={item.id} className="rounded border-l-4 border-emerald-500 bg-emerald-50 p-3">{item.quote}<p className="text-sm">{item.annotation}</p></blockquote>)}</Tabs.Content>
          <Tabs.Content value="stats"><p>已读 {books.filter((book) => book.status === 'read').length} 本，在读 {books.filter((book) => book.status === 'reading').length} 本，阅读时长 {books.reduce((sum, book) => sum + Number(book.reading_minutes ?? 0), 0)} 分钟。</p></Tabs.Content>
        </Tabs.Root>
      </div>
      {keyword && <section className="mt-5 rounded border bg-white p-4 text-gray-900"><h2 className="font-medium">搜索结果</h2><pre className="mt-2 overflow-auto text-xs">{JSON.stringify(results, null, 2)}</pre></section>}
    </main>
  );
}
