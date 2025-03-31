"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "bot"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input } as const,
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/gemini", { message: input });
      const botReply = response.data.reply;

      setMessages([...newMessages, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { role: "bot", content: "Sorry, I couldn't process that request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-[#1A202C]">
      {/* Header */}
      <header className="bg-[#800000] text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="IITM Logo" width={50} height={50} />
          <h1 className="text-2xl font-bold">InstiGPT</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 max-w-4xl">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <Image src="/logo.png" alt="IITM Logo" width={100} height={100} />
            <h2 className="text-2xl font-bold text-[#800000] dark:text-white mb-2">
              Welcome to InstiGPT
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
              Ask me anything about campus life, academic programs, or institute
              policies.
            </p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-[#ffcc00] text-black" // IITM gold
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Field */}
      <footer className="bg-white dark:bg-[#1A202C] border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex text-black gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about IIT Madras..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCC00] dark:bg-[#1A202C] dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className="bg-[#FFCC00] text-[#800000] hover:bg-[#E6B800] p-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
