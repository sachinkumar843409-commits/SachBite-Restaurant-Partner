import React from 'react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col w-full antialiased text-[#1e1e1e] selection:bg-[#fff1e6] selection:text-[#bc5a13]">
      {children}
    </div>
  );
};
