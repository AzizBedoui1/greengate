import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatBubble.css'; 

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your GreenGate assistant. How can I help you?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function for the specific "Featured" route
  const fetchFeatured = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:30001/api/ai/chat');
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: data.reply, 
        blogs: data.sourceData 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Failed to load featured insights." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:30001/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'ai', text: data.reply, blogs: data.sourceData }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-bubble-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="chat-window">
            <div className="chat-header">
              <div className="chat-header-brand"><Bot size={20} /><span>GreenGate AI</span></div>
              <button onClick={() => setIsOpen(false)} className="close-btn"><X size={18} /></button>
            </div>

            <div className="chat-body">
              {messages.map((msg, i) => (
                <div key={i} className={`message-wrapper ${msg.role}`}>
                  <div className={`message-bubble ${msg.role}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.blogs && msg.blogs.map(blog => (
                      <a key={blog._id} href={`/blog/${blog.slug}`} className="blog-card-link">
                        <p className="blog-card-title">{blog.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              {loading && <div className="message-bubble ai loading-dots">...</div>}
              <div ref={scrollRef} />
            </div>

            {/* Feature Trigger Button */}
            <div className="quick-actions">
              <button onClick={fetchFeatured} className="action-pill">
                <Star size={12} /> Featured Insights
              </button>
            </div>

            <div className="chat-input-area">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="chat-input" />
              <button onClick={handleSend} className="send-button"><Send size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className="chat-toggle-btn">
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatBubble;