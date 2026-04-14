import type { Post } from './vicinato.types';

const tipoClass: Record<Post['tipo'], string> = {
  info: 'bg-blue-100 text-blue-800',
  segnalazione: 'bg-orange-100 text-orange-800',
  vendita: 'bg-[#f4e3c3] text-[#7A5A1A]',
  evento: 'bg-green-100 text-green-800',
  altro: 'bg-gray-100 text-gray-700',
};

export function VicinatoPost({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  return (
    <article className="rounded-2xl border border-[#C8A96E]/40 bg-white p-4">
      <div className="flex items-center justify-between">
        <strong>{post.autore}</strong>
        <span className={`rounded px-2 py-1 text-xs ${tipoClass[post.tipo]}`}>{post.tipo}</span>
      </div>
      <p className="mt-2 text-[#1A1A1A]">{post.testo}</p>
      <button onClick={() => onLike(post.id)} className="mt-3 text-sm font-medium text-[#7A5A1A]">Mi piace ({post.likes})</button>
    </article>
  );
}
