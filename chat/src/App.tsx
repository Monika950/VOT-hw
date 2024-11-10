// src/App.tsx
import React, { useState } from 'react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Connection status */}
        <div className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-t-lg">
          You have connected with id: <span className="font-semibold">4coXkc6h60c3iHB4AAAA</span>
        </div>

        {/* Chat messages area */}
        <div className="h-64 p-4 overflow-y-auto border-b border-gray-300">
          {messages.map((message, index) => (
            <div key={index} className="mb-2 text-gray-700">
              {message}
            </div>
          ))}
        </div>

        {/* Message input and controls */}
        <div className="flex items-center p-4 space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>

        {/* Room input */}
        <div className="p-4 border-t border-gray-300">
          <input
            type="text"
            placeholder="Room"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
