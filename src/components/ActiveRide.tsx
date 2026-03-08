import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Phone, MessageSquare, Star } from 'lucide-react';
import { AppState } from '../App';

interface ActiveRideProps {
  state: AppState;
  destination: {title: string} | null;
  onComplete: () => void;
}

export function ActiveRide({ state, destination, onComplete }: ActiveRideProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state === 'RIDING') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 1000);
            return 100;
          }
          return p + 1;
        });
      }, 100); // 10 seconds total
      return () => clearInterval(interval);
    }
  }, [state, onComplete]);

  if (state === 'REQUESTING') {
    return (
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 text-center"
      >
        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-blue-100 rounded-full"
          />
          <div className="absolute inset-2 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
            🔍
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Finding your ride...</h2>
        <p className="text-gray-500 mb-8">Connecting you to a driver nearby</p>
        
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-1/2 h-full bg-black rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Arriving in 3 min</h2>
            <p className="text-gray-500">Heading to {destination?.title}</p>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-lg text-center">
            <div className="text-sm font-bold">ABC 123</div>
            <div className="text-xs text-gray-500">Toyota Prius</div>
          </div>
        </div>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/driver/100/100" 
                alt="Driver" 
                className="w-12 h-12 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
                  4.9 <Star className="w-2 h-2 ml-0.5 fill-current" />
                </div>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-bold">Michael</h3>
              <p className="text-sm text-gray-500">12,405 rides</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Shield className="w-5 h-5 text-blue-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Phone className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
