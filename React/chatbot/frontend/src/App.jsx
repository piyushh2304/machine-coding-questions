import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // List of all chat messages
  const [input, setInput] = useState("");       // Current input text
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Connected!');
    });
    // LISTEN for messages from the Bot
    newSocket.on('message', (data) => {
      // Add the new message to our list
      // We use the functional update (prev => ...) to make sure we have the latest list
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => newSocket.disconnect();
  }, []);
  const handleSend = () => {
    if (!input.trim() || !socket) return; // Don't send empty or if no connection
    // 1. Add MY message to the list immediately (Optimistic UI)
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    // 2. Send to Server
    socket.emit('sendMessage', input);
    // 3. Clear Input
    setInput("");
  };
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Gemini Chatbot</h1>

      {/* Messages Area */}
      <div style={{
        border: '1px solid #ccc',
        height: '400px',
        overflowY: 'scroll',
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.sender === 'user' ? 'right' : 'left',
            margin: '5px 0'
          }}>
            <span style={{
              background: msg.sender === 'user' ? '#007bff' : '#eee',
              color: msg.sender === 'user' ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: '15px',
              display: 'inline-block',
              maxWidth: '80%'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '10px' }}
          placeholder="Ask Gemini something..."
        />
        <button onClick={handleSend} style={{ padding: '10px 20px' }}>Send</button>
      </div>
    </div>
  );
}
export default App;