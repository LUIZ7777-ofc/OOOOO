import React from 'react';
import { motion } from 'motion/react';
import { AppState } from '../App';

export function MapBackground({ state }: { state: AppState }) {
  return (
    <div className="w-full h-full bg-[#e5e3df] relative overflow-hidden">
      {/* Grid pattern to look like streets */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9ca3af 1px, transparent 1px),
            linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Diagonal streets */}
      <div className="absolute inset-0 opacity-10 transform rotate-45 scale-150"
        style={{
          backgroundImage: `linear-gradient(to right, #9ca3af 2px, transparent 2px)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* User Location Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-blue-500 rounded-full"
          />
          <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center relative z-10">
            <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Destination Marker (if selected) */}
      {(state === 'SELECTING_RIDE' || state === 'REQUESTING' || state === 'RIDING') && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-xl">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <div className="w-1 h-4 bg-black mx-auto" />
        </motion.div>
      )}

      {/* Route Line (simulated) */}
      {(state === 'SELECTING_RIDE' || state === 'REQUESTING' || state === 'RIDING') && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M 50% 50% Q 60% 40% 66.6% 33.3%"
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeDasharray="8 8"
          />
        </svg>
      )}

      {/* Car Marker (if riding) */}
      {state === 'RIDING' && (
        <motion.div
          initial={{ top: '50%', left: '50%' }}
          animate={{ top: '33.3%', left: '66.6%' }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
            <span className="text-xl">🚗</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
