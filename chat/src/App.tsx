import React, { useState, useEffect } from 'react';
import { io} from 'socket.io-client';


const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  const [connection,setConnection] = useState<string>(''); 
  
  let socket;
  
  useEffect(() => {
    // Initialize the socket connection
    socket = io('http://localhost:3000'); // Replace with your server URL and port

    // Set up the 'connect' event listener
    socket.on('connect', () => {
      setConnection(socket.id || ''); // Set the connection ID
      socket.emit('custom-event', 10, "Hi", { a: "a" }); // Emit custom event with data
    });

    // Optional: Listen for incoming messages from the server
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  
  

  const handleSend = () => {
    if (input.trim()) {

      setMessages((prevMessages) => [...prevMessages, input]);
      setInput('');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
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
