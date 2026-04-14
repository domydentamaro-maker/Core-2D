import { LiveBooking } from './LiveBooking';
import { LiveRoom } from './LiveRoom';

export default function Live() {
  return (
    <section className="mx-auto max-w-4xl space-y-4 px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1A1A1A]">2D Live</h1>
      <LiveBooking />
      <LiveRoom />
    </section>
  );
}
