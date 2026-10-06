"use client";
import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "bot"; text: string; offerTicket?: boolean };

const FALLBACK_TEXT = "I'm not sure about that";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const [conversationId, setConversationId] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: text }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: data.reply,
          offerTicket: data.reply.startsWith(FALLBACK_TEXT),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      let id = sessionStorage.getItem("chatConversationId");
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem("chatConversationId", id);
      }
      setConversationId(id);
    }, []);

    const createTicket = async () => {
      const token = localStorage.getItem("token"); // <-- apne project me jis key me JWT save karti ho wo likho
      if (!token) {
        setMessages((m) => [
          ...m,
          { role: "bot", text: "Please log in to create a support ticket." },
        ]);
        return;
      }
    
      try {
        const res = await fetch("http://localhost:8080/chat/escalate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId }),
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setMessages((m) => [
          ...m.map((x) => ({ ...x, offerTicket: false })),
          { role: "bot", text: data.message },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "bot", text: "Sorry, I couldn't create the ticket. Please try again." },
        ]);
      }
    };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-5 w-80 h-96 bg-white border rounded-xl shadow-xl flex flex-col">
          <div className="p-3 bg-blue-600 text-white rounded-t-xl font-semibold">
            Support Bot
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.text}
                </div>
                {m.offerTicket && (
                  <button
                    onClick={createTicket}
                    className="mt-1 text-xs bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Create a support ticket
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500">Bot is typing...</div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm text-gray-900"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question..."
            />
            <button
              onClick={send}
              className="bg-blue-600 text-white px-3 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-blue-600 text-white text-xl shadow-lg"
      >
        💬
      </button>
    </>
  );
}