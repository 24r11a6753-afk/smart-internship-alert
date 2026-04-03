import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI career guide. Ask me about hackathons, internships, or resume tips!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('https://smart-internship-alert.onrender.com/api/ai/chat',
        { message: userMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the network right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg shadow-primary/40 hover:bg-primary-hover transition-all transform hover:scale-110 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white border border-amber-200 rounded-2xl shadow-xl shadow-slate-200/50 z-50 flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-amber-50 rounded-t-2xl">
          <div className="flex items-center">
            <div className="bg-primary p-2 rounded-lg mr-3 shadow-inner">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-sm tracking-wide flex items-center">
                SmartGuide AI <Sparkles className="w-3 h-3 text-yellow-400 ml-1" />
              </h3>
              <p className="text-green-400 text-xs flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-slate-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20' 
                    : 'bg-amber-50 text-slate-800 rounded-bl-none shadow-sm border border-amber-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-amber-50 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-amber-200">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-amber-200 bg-amber-50/50 rounded-b-2xl flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-slate-400"
            placeholder="Ask about opportunities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-primary text-white rounded-xl shadow-md shadow-primary/20 hover:bg-primary-hover transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatbotWidget;
