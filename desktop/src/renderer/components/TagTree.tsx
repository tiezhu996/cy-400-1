import { TAG_ROOTS } from '../constants/enums';

export function TagTree() {
  return <div className="space-y-2 text-sm">{TAG_ROOTS.map((tag) => <div key={tag} className="rounded border border-gray-200 px-3 py-2">{tag}</div>)}</div>;
}
