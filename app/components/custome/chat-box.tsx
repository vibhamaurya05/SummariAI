"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useTheme } from "next-themes";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const userInput = input;
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await res.json();
      const fullResponse = data.response || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "bot", text: "" }]);

      for (let i = 0; i <= fullResponse.length; i++) {
        await new Promise((res) => setTimeout(res, 10));
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.role === "bot") {
            updated[updated.length - 1] = {
              ...lastMsg,
              text: fullResponse.slice(0, i),
            };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Error calling AI API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong. Try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className={`flex flex-col max-w-3xl w-full h-[500px] sm:h-[600px] lg:h-[900px] shadow-lg rounded-2xl overflow-hidden border transition-all duration-300
      ${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-gray-200"}
    `}>
      {/* Chat Window */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 
        ${theme === "dark" ? "bg-zinc-900" : "bg-gray-50"}
      `}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-fit max-w-[80%] p-3 rounded-xl text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : theme === "dark"
                  ? "bg-zinc-800 text-white self-start mr-auto"
                  : "bg-gray-200 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.role === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </motion.div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="w-fit p-3 rounded-xl text-blue-500 text-sm self-start mr-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Sparkles size={20} />
            </motion.div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`flex items-center gap-2 p-4 border-t transition-all duration-300
        ${theme === "dark" ? "bg-black border-zinc-800" : "bg-white border-gray-200"}
      `}>
        <input
          type="text"
          placeholder="Type your message..."
          className={`flex-1 p-2 rounded-md border transition-all duration-200
            ${theme === "dark"
              ? "bg-zinc-800 text-white border-zinc-700 focus:ring-zinc-500"
              : "bg-white text-black border-gray-300 focus:ring-blue-500"}
            focus:outline-none focus:ring-2
          `}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition disabled:opacity-50"
          disabled={isLoading}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}
