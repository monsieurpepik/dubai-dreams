import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/SEO';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Msg = { role: 'user' | 'assistant'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qualify-lead`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (resp.status === 429) {
    toast.error('Too many requests. Please wait a moment.');
    onDone();
    return;
  }
  if (resp.status === 402) {
    toast.error('Service temporarily unavailable.');
    onDone();
    return;
  }
  if (!resp.ok || !resp.body) throw new Error('Failed to start stream');

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (line.startsWith(':') || line.trim() === '') continue;
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { streamDone = true; break; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + '\n' + buffer;
        break;
      }
    }
  }
  onDone();
}

export default function Advisor() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;
    setInput('');
    setHasStarted(true);

    const userMsg: Msg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const starters = [
    'I want to invest in Dubai for the first time',
    'Looking for Golden Visa eligible properties',
    'Help me compare off-plan vs ready properties',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Private Advisor — OwningDubai" description="AI-powered investment advisor for Dubai off-plan real estate." />
      <Header />

      <main className="flex-1 flex flex-col pt-20 md:pt-24">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container-wide max-w-2xl mx-auto py-8 md:py-16 px-6">
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="font-serif text-2xl md:text-4xl text-foreground mb-3">
                  Private Advisor
                </h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10">
                  Tell me about your investment goals. I'll recommend projects that match your profile.
                </p>
                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  {starters.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-sm text-muted-foreground border border-border/40 px-5 py-3 hover:border-foreground/30 hover:text-foreground transition-all duration-300"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-8 ${msg.role === 'user' ? 'text-right' : ''}`}
                >
                  {msg.role === 'user' ? (
                    <div className="inline-block text-left bg-secondary/50 px-5 py-3 max-w-[85%]">
                      <p className="text-sm text-foreground">{msg.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-full prose prose-sm prose-neutral
                      prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground
                      prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:text-sm
                      prose-a:text-foreground prose-strong:text-foreground prose-strong:font-medium
                      prose-li:text-muted-foreground prose-li:text-sm
                    ">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="mb-8">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border/10 bg-background">
          <div className="container-wide max-w-2xl mx-auto px-6 py-4">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me about your investment goals..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
