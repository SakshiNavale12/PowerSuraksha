import React, { useState } from 'react';

export default function MotorControl() {
  // State to track if the motor is on or off. 'false' means off by default.
  const [isOn, setIsOn] = useState(false);

  // Function to handle the button click
  const handleToggle = () => {
    setIsOn(prevState => !prevState);
    // In a real application, you would add API calls here
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      {/* Status Indicator */}
      <div className="mb-3 flex items-center justify-between">
        <strong className="font-medium text-gray-500">Status:</strong>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isOn
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {isOn ? 'STOPPED' : 'RUNNING'}
        </span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`w-full rounded-lg px-3 py-1 font-medium text-white shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOn
            ? ' bg-green-500 hover:bg-green-600 focus:ring-green-500' // Red when ON (shows "Turn Off")
            : 'bg-red-500 hover:bg-red-600 focus:ring-red-500' // Green when OFF (shows "Turn On")
        }`}
      >
        {isOn ? 'Turn ON Motor' : 'Turn OFF Motor'}
      </button>
    </div>
  );
}