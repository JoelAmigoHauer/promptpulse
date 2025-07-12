import React, { useState, useEffect } from 'react';
import { Clock, HelpCircle } from 'lucide-react';

const HeaderBar = () => {
  const [timer, setTimer] = useState('00:25:15');
  const [pendingTasks] = useState(3);

  useEffect(() => {
    // Simulate a countdown timer
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();
      
      // Create a mock timer that counts down
      const mockMinutes = (25 - minutes % 26).toString().padStart(2, '0');
      const mockSeconds = (59 - seconds).toString().padStart(2, '0');
      const mockHours = (hours % 24).toString().padStart(2, '0');
      
      setTimer(`${mockHours}:${mockMinutes}:${mockSeconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
      {/* Left Side - Pending Tasks */}
      <div className="flex items-center">
        <div className="bg-gray-200 rounded-full px-3 py-1 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 font-mono">{timer}</span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-700">
            {pendingTasks} pending prompt{pendingTasks !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Right Side - Help Button */}
      <div className="flex items-center">
        <button className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;