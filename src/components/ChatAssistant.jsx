import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Send, Bot, User, HelpCircle } from 'lucide-react';
import { askPropertyQuestion } from '../utils/aiClient';

export function ChatAssistant({ selectedCity }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I am your UPYOG Property Tax Assistant. Ask me anything about collections, registration counts, approval rates, or city comparisons.",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Suggested question chips for instant feedback
  const sampleQuestions = [
    "Which city has the highest total collection?",
    "How many properties are rejected in Mumbai?",
    "What percentage of Delhi properties are approved?",
    "Which city has the most pending properties?",
    "Compare total registrations between Pune and Jaipur."
  ];

  // Auto scroll to latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || textToSend.trim() === '') return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askPropertyQuestion(textToSend, selectedCity);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "Sorry, I had trouble answering that question. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="glass-card chat-panel">
      <div className="chat-header-section">
        <Bot size={20} className="text-success" />
        <h2 className="chat-header-title">UPYOG AI Tax Assistant</h2>
      </div>

      <div className="chat-history">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${
              msg.role === 'user' ? 'message-user' : 'message-ai'
            }`}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '0.125rem' }}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div style={{ flex: 1, wordBreak: 'break-word' }}>{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble message-ai" style={{ width: 'fit-content' }}>
            <div className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          <HelpCircle size={12} className="text-secondary" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Suggested Queries:</span>
        </div>
        <div className="chips-container">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="chip-btn"
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="chat-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about the dataset..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-submit-btn"
            disabled={isLoading || !inputValue.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

ChatAssistant.propTypes = {
  selectedCity: PropTypes.string.isRequired
};

