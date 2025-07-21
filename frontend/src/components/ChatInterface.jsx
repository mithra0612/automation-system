import { useState, useRef, useEffect } from 'react';

function ChatInterface({ repo, user }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to the chat! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: 'user', text: input }
    ]);
    // Simulate bot response
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: "I'm a demo bot. Real chat coming soon!" }
      ]);
    }, 700);
    setInput('');
  };

  return (
    <div className="flex flex-col h-64 bg-gray-900/95 rounded-lg border border-gray-800/70 shadow-inner p-4">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;
