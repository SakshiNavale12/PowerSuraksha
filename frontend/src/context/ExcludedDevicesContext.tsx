// src/context/ExcludedDevicesContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ExcludedDevicesContext = createContext<{
  excludedIds: string[];
  setExcludedIds: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  excludedIds: [],
  setExcludedIds: () => {},
});

export const ExcludedDevicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  return (
    <ExcludedDevicesContext.Provider value={{ excludedIds, setExcludedIds }}>
      {children}
    </ExcludedDevicesContext.Provider>
  );
};

export const useExcludedDevices = () => useContext(ExcludedDevicesContext);
