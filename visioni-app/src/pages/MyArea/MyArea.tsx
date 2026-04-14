import { Link } from 'react-router-dom';
import { myAreaMeta } from './meta';

const entries = [
  { to: '/my-area/memoria', title: 'Memoria' },
  { to: '/my-area/advisor', title: 'Advisor' },
  { to: '/my-area/vicinato', title: 'Vicinato' },
  { to: '/my-area/ambassador', title: 'Ambassador' },
  { to: '/my-area/live', title: 'Live' },
];

export default function MyArea() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">{myAreaMeta.title}</h1>
      <p className="mt-3 text-[#4D463E]">{myAreaMeta.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => (
          <Link key={e.to} to={e.to} className="rounded-2xl border border-[#C8A96E]/40 bg-[#F5F0E8] p-5 font-semibold text-[#1A1A1A] hover:shadow-lg">
            {e.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
