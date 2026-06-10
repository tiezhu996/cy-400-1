export function SearchBar({ value, onChange }: { value: string; onChange(value: string): void }) {
  return <input className="w-full rounded border px-3 py-2 text-sm text-gray-900" placeholder="搜索书籍、笔记或摘录" value={value} onChange={(event) => onChange(event.target.value)} />;
}
