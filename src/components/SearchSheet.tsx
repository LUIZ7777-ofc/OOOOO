import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft, MapPin, Sparkles, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { searchNearbyPlaces, Place } from '../services/ai';

interface SearchSheetProps {
  location: {lat: number, lng: number} | null;
  onClose: () => void;
  onSelect: (place: Place) => void;
}

export function SearchSheet({ location, onClose, onSelect }: SearchSheetProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{text: string, places: Place[]} | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2 && location) {
        performSearch();
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location]);

  const performSearch = async () => {
    if (!location) return;
    setIsSearching(true);
    try {
      const res = await searchNearbyPlaces(query, location.lat, location.lng);
      setResults(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="bg-white h-[85vh] rounded-t-3xl shadow-2xl flex flex-col"
    >
      <div className="p-4 flex items-center border-b border-gray-100">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 ml-2 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black rounded-full" />
          <input 
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-gray-100 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!query && (
          <div className="text-center text-gray-500 mt-10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Type a destination to search with Gemini AI</p>
          </div>
        )}

        {isSearching && (
          <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Finding the best spots...</p>
          </div>
        )}

        {!isSearching && results && (
          <div className="space-y-6">
            {results.text && (
              <div className="bg-blue-50 p-4 rounded-2xl flex items-start">
                <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-900 leading-relaxed markdown-body">
                  <Markdown>{results.text}</Markdown>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Places</h3>
              {results.places.length === 0 ? (
                <p className="text-gray-500 text-sm">No specific places found. Try another search.</p>
              ) : (
                results.places.map((place, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onSelect(place)}
                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{place.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{place.uri}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
