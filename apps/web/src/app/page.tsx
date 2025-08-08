'use client';
import { useEffect, useRef, useState } from 'react';

type ChatRole = 'system' | 'user' | 'assistant' | 'tool';
interface ChatMessage { role: ChatRole; content: string; }

export default function Page() {
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [tone, setTone] = useState<'neutral' | 'friendly' | 'formal'>('neutral');
  const [memory, setMemory] = useState<'full' | 'short'>('full');
  const [streaming, setStreaming] = useState(false);
  const [speakReply, setSpeakReply] = useState(false);
  const [listening, setListening] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pendingAssistantRef = useRef<string>('');

  useEffect(() => () => { eventSourceRef.current?.close(); }, []);

  function speak(text: string) {
    if (!speakReply || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0; utter.pitch = 1.0;
    synth.cancel();
    synth.speak(utter);
  }

  function startListening() {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech Recognition not supported in this browser'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let txt = '';
      for (const res of e.results) { txt += res[0].transcript; }
      setInput(txt.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  async function sendMessage() {
    if (!input.trim() || streaming) return;
    const userMessage = { role: 'user' as const, content: decoratePrompt(input) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStreaming(true);
    pendingAssistantRef.current = '';

    const url = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8787';
    const payload = { conversationId, messages: [userMessage], settings: { model, systemPrompt: systemPrompt() }, stream: true };
    const es = new EventSource(url + '/v1/chat/stream?payload=' + encodeURIComponent(JSON.stringify(payload)));
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'meta' && data.conversationId) {
        setConversationId(data.conversationId);
        return;
      }
      if (data.type === 'delta') {
        pendingAssistantRef.current += data.delta;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant') {
            const updated = { ...last, content: last.content + data.delta };
            return [...prev.slice(0, -1), updated];
          }
          return [...prev, { role: 'assistant', content: data.delta }];
        });
      }
      if (data.type === 'done') {
        es.close();
        setStreaming(false);
        speak(pendingAssistantRef.current);
      }
    };

    es.onerror = () => { es.close(); setStreaming(false); };
  }

  function systemPrompt() {
    const toneInstr = tone === 'friendly' ? 'Be friendly and supportive.' : tone === 'formal' ? 'Be formal and concise.' : 'Be clear and neutral.';
    const memoryInstr = memory === 'short' ? 'Only use the last 6 messages as context.' : 'Use the full conversation context.';
    return `${toneInstr} ${memoryInstr}`;
  }

  function decoratePrompt(userText: string) {
    return userText;
  }

  return (
    <div className="container">
      <h1>Convo AI</h1>
      <div className="meta">Model: {model}</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label>Model <input value={model} onChange={e => setModel(e.target.value)} style={{ marginLeft: 6 }} /></label>
        <label>Tone
          <select value={tone} onChange={e => setTone(e.target.value as any)} style={{ marginLeft: 6 }}>
            <option value="neutral">Neutral</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </label>
        <label>Memory
          <select value={memory} onChange={e => setMemory(e.target.value as any)} style={{ marginLeft: 6 }}>
            <option value="full">Full</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={speakReply} onChange={e => setSpeakReply(e.target.checked)} /> Speak replies
        </label>
        <button onClick={startListening} disabled={listening}>{listening ? 'Listening…' : '🎙️ Speak'}</button>
      </div>

      <div className="chat" style={{ marginTop: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div className="badge">{m.role}</div>
            <div className="message">{m.content}</div>
          </div>
        ))}
        <div className="row">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
          <button onClick={sendMessage} disabled={streaming}>Send</button>
        </div>
      </div>
    </div>
  );
}
