import { useState } from 'react';
import { generateAdvisorReply } from './AdvisorEngine';
import type { AdvisorMessage } from './advisor.types';

export function AdvisorChat() {
  const [messages, setMessages] = useState<AdvisorMessage[]>([
    { role: 'assistant', content: 'Ciao, sono 2D Advisor. Dimmi obiettivo e budget.', timestamp: new Date() },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    const userMsg: AdvisorMessage = { role: 'user', content: text, timestamp: new Date() };
    const aiMsg: AdvisorMessage = { role: 'assistant', content: generateAdvisorReply(text), timestamp: new Date() };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setText('');
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-lg">
      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`rounded-xl p-3 text-sm ${m.role === 'assistant' ? 'bg-[#F5F0E8]' : 'bg-[#1A1A1A] text-[#F5F0E8]'}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input className="flex-1 rounded-lg border p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Scrivi qui..." />
        <button className="rounded-lg bg-[#C8A96E] px-4 font-semibold text-[#1A1A1A]" onClick={send}>Invia</button>
      </div>
    </div>
  );
}
