/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapBackground } from './components/MapBackground';
import { SearchSheet } from './components/SearchSheet';
import { RideOptions } from './components/RideOptions';
import { ActiveRide } from './components/ActiveRide';
import { Menu, User, Search } from 'lucide-react';

export type AppState = 'IDLE' | 'SEARCHING' | 'SELECTING_RIDE' | 'REQUESTING' | 'RIDING';

export default function App() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [destination, setDestination] = useState<{title: string, uri: string} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err)
      );
    }
  }, []);

  useEffect(() => {
    if (appState === 'REQUESTING') {
      const timer = setTimeout(() => {
        setAppState('RIDING');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center pointer-events-none">
        <button className="p-3 bg-white rounded-full shadow-md pointer-events-auto hover:bg-gray-50 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <button className="p-3 bg-white rounded-full shadow-md pointer-events-auto hover:bg-gray-50 transition-colors">
          <User className="w-6 h-6" />
        </button>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <MapBackground state={appState} />
      </div>

      {/* Bottom Sheets */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex flex-col justify-end h-full">
        <div className="pointer-events-auto w-full max-w-md mx-auto relative">
          {appState === 'IDLE' && (
            <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 pb-8 transition-transform duration-300">
              <h2 className="text-2xl font-bold mb-4">Where to?</h2>
              <button 
                onClick={() => setAppState('SEARCHING')}
                className="w-full bg-gray-100 p-4 rounded-xl flex items-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5 mr-3" />
                <span className="text-lg font-medium">Search destination</span>
              </button>
            </div>
          )}

          {appState === 'SEARCHING' && (
            <SearchSheet 
              location={location} 
              onClose={() => setAppState('IDLE')} 
              onSelect={(place) => {
                setDestination(place);
                setAppState('SELECTING_RIDE');
              }} 
            />
          )}

          {appState === 'SELECTING_RIDE' && destination && (
            <RideOptions 
              destination={destination} 
              onBack={() => setAppState('SEARCHING')}
              onRequest={() => setAppState('REQUESTING')}
            />
          )}

          {(appState === 'REQUESTING' || appState === 'RIDING') && (
            <ActiveRide 
              state={appState} 
              destination={destination} 
              onComplete={() => {
                setAppState('IDLE');
                setDestination(null);
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
