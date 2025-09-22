
import React from 'react';
import { CloseIcon } from './Icons';

type SettingsPanelProps = {
  detectionInterval: number;
  setDetectionInterval: (value: number) => void;
  onClose: () => void;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  detectionInterval,
  setDetectionInterval,
  onClose,
}) => {
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetectionInterval(Number(e.target.value));
  };
  
  const intervalInSeconds = detectionInterval / 1000;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" aria-label="Close settings">
            <CloseIcon className="w-6 h-6"/>
        </button>
        <h2 className="text-2xl font-bold text-teal-300 mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="detectionInterval" className="block text-sm font-medium text-gray-300 mb-2">
              Detection Frequency
            </label>
            <div className="flex items-center space-x-4">
                <input
                    id="detectionInterval"
                    type="range"
                    min="1000" // 1 second
                    max="10000" // 10 seconds
                    step="500"
                    value={detectionInterval}
                    onChange={handleIntervalChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <span className="text-teal-300 font-mono w-16 text-right">{intervalInSeconds.toFixed(1)}s</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                How often the system analyzes your surroundings. Faster is more responsive but uses more data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
