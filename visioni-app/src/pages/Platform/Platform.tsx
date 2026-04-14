import { Link } from 'react-router-dom';
import { RadarIcon, ScoreIcon, DistrettoIcon, AdvisorIcon, LiveIcon } from '../../components/Icons/Icons';
import { platformMeta } from './meta';

const cards = [
  { to: '/radar', title: 'Radar', Icon: RadarIcon },
  { to: '/anticipa', title: 'Anticipa', Icon: LiveIcon },
  { to: '/profezia', title: 'Profezia', Icon: ScoreIcon },
  { to: '/distretto', title: 'Distretto', Icon: DistrettoIcon },
  { to: '/my-area/advisor', title: 'Advisor', Icon: AdvisorIcon },
];

export default function Platform() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">{platformMeta.title}</h1>
      <p className="mt-3 text-[#4D463E]">{platformMeta.description}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ to, title, Icon }) => (
          <Link key={to} to={to} className="group rounded-2xl border border-[#C8A96E]/50 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
            <Icon className="text-[#C8A96E]" />
            <h2 className="mt-4 text-2xl font-semibold text-[#1A1A1A]">{title}</h2>
          </Link>
        ))}
      </div>
    </section>
  );
}
