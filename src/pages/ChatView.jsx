import React, { useState } from 'react';
import { Send, Bot, User, Sun, Zap, AlertTriangle, Loader2 } from 'lucide-react';
import { getCanvasAPI } from '../lib/canvas';

export default function ChatView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const canvasApi = getCanvasAPI();
      const response = await canvasApi.fetch('/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage })
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (text) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">

        {messages.length === 0 ? (
          <div className="w-full max-w-4xl mt-2 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white mb-8">Portrait AI</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-center">
              {/* Examples Column */}
              <div className="space-y-3 flex flex-col">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <Sun className="w-5 h-5 text-white" />
                  <h3 className="text-base font-medium text-white">Examples</h3>
                </div>
                <button onClick={() => handleExampleClick("Calculate the lowest score I need on my next CS37 exam to keep an A")} className="w-full p-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs text-neutral-300 transition-colors flex-1 flex items-center justify-center text-center">
                  "Calculate the lowest score I need on my next CS37 exam to keep an A" &rarr;
                </button>
                <button onClick={() => handleExampleClick("Summarize the latest announcement from my History class")} className="w-full p-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs text-neutral-300 transition-colors flex-1 flex items-center justify-center text-center">
                  "Summarize the latest announcement from my History class" &rarr;
                </button>
                <button onClick={() => handleExampleClick("Based on my syllabi, what should I study tonight?")} className="w-full p-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-lg text-xs text-neutral-300 transition-colors flex-1 flex items-center justify-center text-center">
                  "Based on my syllabi, what should I study tonight?" &rarr;
                </button>
              </div>

              {/* Capabilities Column */}
              <div className="space-y-3 flex flex-col">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <Zap className="w-5 h-5 text-white" />
                  <h3 className="text-base font-medium text-white">Capabilities</h3>
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  Automatically syncs and indexes all your course syllabi via Canvas
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  Optimizes your study workflow based on assignment weights and deadlines
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  Generates custom practice material using RAG on your specific class files
                </div>
              </div>

              {/* Limitations Column */}
              <div className="space-y-3 flex flex-col">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <h3 className="text-base font-medium text-white">Limitations</h3>
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  May occasionally provide incorrect information if a syllabus is outdated
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  Cannot submit assignments on your behalf (yet)
                </div>
                <div className="w-full p-3 bg-neutral-800/30 border border-neutral-700/30 rounded-lg text-xs text-neutral-300 flex-1 flex items-center justify-center text-center">
                  Knowledge is limited to the documents uploaded to your Canvas portal
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-neutral-800 border border-neutral-700'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-500" />}
                </div>
                <div className={`rounded-3xl p-5 text-lg leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800/80 text-neutral-200 border border-neutral-700 backdrop-blur-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Portrait AI about your classes, deadlines, or grades..."
              className="w-full bg-neutral-800/90 border border-neutral-700 rounded-2xl py-4 pl-6 pr-14 text-lg text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner backdrop-blur-md"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-colors disabled:opacity-50" disabled={!input.trim() || isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-neutral-500">
            Portrait AI can make mistakes. Consider verifying important deadlines on Canvas directly.
          </div>
        </div>
      </div>
    </div>
  );
}
