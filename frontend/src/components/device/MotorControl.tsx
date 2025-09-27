import  { useState } from 'react';

export default function MotorControl() {
  const [isOn] = useState(false);



  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-gray-500">Status:</p>
        <span
          className={`rounded-full px-2.5 py-1 text-sm font-semibold ${
            isOn
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {isOn ? 'STOPPED' : 'RUNNING'}
        </span>
      </div>
    </div>
  );
}