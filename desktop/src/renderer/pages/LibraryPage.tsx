import { useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useLibraryStore } from '../stores/libraryStore';
import { SearchBar } from '../components/SearchBar';
import { TagTree } from '../components/TagTree';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { useSearch } from '../hooks/useSearch';

export function LibraryPage() {
  const { books, notes, highlights, theme, load, toggleTheme, addSampleData } = useLibraryStore();
  const [keyword, setKeyword] = useState('');
  const [draft, setDraft] = useState('## 今日笔记\n');
  const results = useSearch(books, notes, highlights, keyword);
  useEffect(() => { void load(); }, [load]);

  return <main className={theme === 'dark' ? 'dark min-h-screen p-6' : 'min-h-screen bg-gray-50 p-6 text-gray-900'}>
    <header className="mb-5 flex items-center justify-between">
      <div><h1 className="text-2xl font-semibold">读书笔记</h1><p className="text-sm text-gray-500">本地书库、笔记、摘录和全文搜索</p></div>
      <div className="flex gap-2"><button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={() => void addSampleData()}>示例数据</button><button className="rounded border px-3 py-2" onClick={toggleTheme}>切换主题</button></div>
    </header>
    <SearchBar value={keyword} onChange={setKeyword} />
    <div className="mt-5 grid grid-cols-[240px_1fr] gap-5">
      <aside className="space-y-4"><h2 className="font-medium">标签树</h2><TagTree /></aside>
      <Tabs.Root defaultValue="books" className="rounded border bg-white p-4 text-gray-900">
        <Tabs.List className="mb-4 flex gap-2"><Tabs.Trigger value="books">书籍</Tabs.Trigger><Tabs.Trigger value="notes">笔记</Tabs.Trigger><Tabs.Trigger value="highlights">摘录</Tabs.Trigger><Tabs.Trigger value="stats">统计</Tabs.Trigger></Tabs.List>
        <Tabs.Content value="books" className="grid gap-3">{books.map((book) => <section key={book.id} className="rounded border p-3"><b>{book.title}</b><p>{book.author} · {book.status}</p></section>)}</Tabs.Content>
        <Tabs.Content value="notes"><MarkdownEditor value={draft} onChange={setDraft} /><div className="mt-4 space-y-2">{notes.map((note) => <article key={note.id} className="rounded border p-3"><b>{note.title}</b><pre className="whitespace-pre-wrap text-sm">{note.markdown}</pre></article>)}</div></Tabs.Content>
        <Tabs.Content value="highlights" className="space-y-2">{highlights.map((item) => <blockquote key={item.id} className="rounded border-l-4 border-emerald-500 bg-emerald-50 p-3">{item.quote}<p className="text-sm">{item.annotation}</p></blockquote>)}</Tabs.Content>
        <Tabs.Content value="stats"><p>已读 {books.filter((book) => book.status === 'read').length} 本，在读 {books.filter((book) => book.status === 'reading').length} 本，阅读时长 {books.reduce((sum, book) => sum + Number(book.reading_minutes ?? 0), 0)} 分钟。</p></Tabs.Content>
      </Tabs.Root>
    </div>
    {keyword && <section className="mt-5 rounded border bg-white p-4 text-gray-900"><h2 className="font-medium">搜索结果</h2><pre className="mt-2 overflow-auto text-xs">{JSON.stringify(results, null, 2)}</pre></section>}
  </main>;
}
