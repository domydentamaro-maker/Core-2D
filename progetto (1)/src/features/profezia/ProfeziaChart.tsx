import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Row { anno: string; pessimista: number; base: number; ottimista: number }

export function ProfeziaChart({ valore, one, three, five }: { valore: number; one: number; three: number; five: number }) {
  const data: Row[] = [
    { anno: '0', pessimista: valore, base: valore, ottimista: valore },
    { anno: '1', pessimista: Math.round(one * 0.8), base: one, ottimista: Math.round(one * 1.2) },
    { anno: '3', pessimista: Math.round(three * 0.8), base: three, ottimista: Math.round(three * 1.2) },
    { anno: '5', pessimista: Math.round(five * 0.8), base: five, ottimista: Math.round(five * 1.2) },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="anno" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pessimista" stroke="#7a7a7a" />
          <Line type="monotone" dataKey="base" stroke="#C8A96E" strokeWidth={3} />
          <Line type="monotone" dataKey="ottimista" stroke="#2d8f58" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
