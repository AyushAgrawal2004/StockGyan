import React, { createContext, useContext, useState } from 'react';

const BeginnerModeContext = createContext();

export const BeginnerModeProvider = ({ children }) => {
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);

  return (
    <BeginnerModeContext.Provider value={{ isBeginnerMode, setIsBeginnerMode }}>
      {children}
    </BeginnerModeContext.Provider>
  );
};

export const useBeginnerMode = () => useContext(BeginnerModeContext);
