import React, { useState, useEffect } from 'react';
import { socket } from './socket';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connection, setConnection] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [room, setRoom] = useState<string>(''); // Added room state

  useEffect(() => {
    // Listen for connection and disconnection events
    socket.on('connect', () => {
      setConnection(socket.id || '');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for incoming messages
    socket.on('receive-message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount to prevent memory leaks
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-message');
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, input]);
      socket.emit('send-message', input, room); // Emit message with room
      setInput(''); // Clear input after sending
    }
  };

  const handleJoinRoom = () => {
    if (room.trim()) {
      socket.emit('join-room', room); // Emit join-room event
      setMessages([]); // Clear messages when joining a new room
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
        {/* Connection status */}
        <div className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-t-lg">
          You have connected with id: <span className="font-semibold">{connection}</span>
        </div>

        {/* Chat messages area */}
        <div className="h-64 p-4 overflow-y-auto border-b border-gray-300">
          {messages.map((message, index) => (
            <div key={index} className="mb-2 text-gray-700">
              {message}
            </div>
          ))}
        </div>

        {/* Message input and send button */}
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

        {/* Room input and join button */}
        <div className="p-4 border-t border-gray-300">
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)} // Update room state
            placeholder="Room"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={handleJoinRoom} // Join room on button click
            className="w-full mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
