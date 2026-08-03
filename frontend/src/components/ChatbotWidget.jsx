import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, SendHorizonal, X } from "lucide-react";
import { STR, useLang } from "@/lib/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ChatbotWidget = () => {
  const { lang } = useLang();
  const s = STR[lang].chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [{ role: "assistant", content: s.greeting }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const sessionRef = useRef(null);
  const listRef = useRef(null);

  if (!sessionRef.current) {
    sessionRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || streaming) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }, { role: "assistant", content: "" }]);
    setStreaming(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionRef.current, message }),
      });
      if (!res.ok || !res.body) throw new Error("chat failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const { done: readerDone, value } = await reader.read();
        if (readerDone) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const data = part.slice(6);
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const chunk = parsed.delta || parsed.error;
            if (chunk) {
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: next[next.length - 1].content + chunk };
                return next;
              });
            }
          } catch {
            /* partial json, wait for more */
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: s.error };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      <motion.button
        data-testid="chatbot-open-button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-[95] flex h-14 w-14 items-center justify-center border-2 border-ink bg-brand-red text-paper shadow-[4px_4px_0_#111]"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            data-testid="chatbot-panel"
            role="dialog"
            aria-label="Ask Buland Awaaz AI assistant"
            className="fixed bottom-24 right-6 z-[95] flex h-[540px] w-[calc(100vw-3rem)] max-w-[400px] flex-col border-2 border-ink bg-ink text-paper shadow-[8px_8px_0_rgba(17,17,17,0.35)]"
          >
            <div className="flex items-center justify-between border-b-2 border-paper/20 px-5 py-4">
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em]">{s.title}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-paper/50">{s.headerSub}</p>
              </div>
              <span className="h-2.5 w-2.5 animate-pulse bg-brand-yellow" aria-hidden="true" />
            </div>

            <div ref={listRef} data-testid="chatbot-messages" className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] border px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "border-brand-red bg-brand-red text-paper"
                        : "border-paper/25 bg-paper/5 text-paper"
                    }`}
                  >
                    {m.content}
                    {streaming && i === messages.length - 1 && m.role === "assistant" && (
                      <span className="chat-caret ml-0.5 inline-block h-3 w-1.5 bg-brand-yellow align-middle" />
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {s.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      data-testid={`chatbot-suggestion-${i}`}
                      onClick={() => send(sug)}
                      className="border border-paper/30 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-paper/70 transition-colors duration-200 hover:border-brand-yellow hover:text-brand-yellow"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              className="flex items-center gap-2 border-t-2 border-paper/20 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                data-testid="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={s.placeholder}
                aria-label="Chat message"
                className="flex-1 border-2 border-paper/25 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-paper/40 focus:border-brand-yellow"
              />
              <button
                data-testid="chatbot-send-button"
                type="submit"
                disabled={streaming || !input.trim()}
                aria-label="Send message"
                className="flex h-11 w-11 items-center justify-center border-2 border-brand-red bg-brand-red text-paper transition-colors duration-200 hover:bg-transparent hover:text-brand-red disabled:opacity-50"
              >
                <SendHorizonal className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
