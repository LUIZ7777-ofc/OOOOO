import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Clock, Sparkles } from 'lucide-react';
import { estimateRide } from '../services/ai';

interface RideOptionsProps {
  destination: {title: string, uri: string};
  onBack: () => void;
  onRequest: () => void;
}

interface RideOption {
  id: string;
  name: string;
  price: number;
  eta: number;
  description: string;
}

export function RideOptions({ destination, onBack, onRequest }: RideOptionsProps) {
  const [options, setOptions] = useState<RideOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      const res = await estimateRide(destination.title);
      setOptions(res);
      if (res.length > 0) setSelectedId(res[0].id);
      setIsLoading(false);
    };
    fetchOptions();
  }, [destination]);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex flex-col max-h-[85vh]"
    >
      <div className="p-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 ml-2 text-center mr-10">
          <h2 className="font-semibold truncate">{destination.title}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
            <div className="text-center text-sm text-gray-500 flex items-center justify-center mt-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Gemini is estimating fares...
            </div>
          </div>
        ) : (
          options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all ${
                selectedId === opt.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="w-16 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-2xl">
                {opt.name.toLowerCase().includes('premium') ? '🚙' : opt.name.toLowerCase().includes('comfort') ? '🚘' : '🚗'}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-lg">{opt.name}</h3>
                  <span className="font-bold text-lg">${opt.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {opt.eta} min away</span>
                  <span className="truncate ml-2">{opt.description}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center text-gray-700 font-medium">
            <CreditCard className="w-5 h-5 mr-2" />
            Personal •••• 1234
          </div>
        </div>
        <button 
          onClick={onRequest}
          disabled={isLoading || !selectedId}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Choose {options.find(o => o.id === selectedId)?.name || 'Ride'}
        </button>
      </div>
    </motion.div>
  );
}
