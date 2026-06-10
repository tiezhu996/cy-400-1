import MDEditor from '@uiw/react-md-editor';

export function MarkdownEditor({ value, onChange }: { value: string; onChange(value: string): void }) {
  return <MDEditor value={value} onChange={(next) => onChange(next ?? '')} height={320} />;
}
