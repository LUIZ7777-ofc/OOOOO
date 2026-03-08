import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Place {
  title: string;
  uri: string;
}

export async function searchNearbyPlaces(query: string, lat: number, lng: number) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `I am looking for "${query}". What are some good options nearby? Keep the response very brief and conversational.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      },
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const places: Place[] = [];
  
  for (const chunk of chunks) {
    // @ts-ignore
    if (chunk.maps?.uri && chunk.maps?.title) {
      // @ts-ignore
      places.push({ title: chunk.maps.title, uri: chunk.maps.uri });
    } else if (chunk.web?.uri && chunk.web?.title) {
      // @ts-ignore
      places.push({ title: chunk.web.title, uri: chunk.web.uri });
    }
  }

  // Deduplicate places by URI
  const uniquePlaces = Array.from(new Map(places.map(p => [p.uri, p])).values());

  return {
    text: response.text,
    places: uniquePlaces,
  };
}

export async function estimateRide(destination: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `I am taking a ride to "${destination}". Generate 3 ride options (e.g., Standard, Comfort, Premium). For each, provide a price in USD (between $10 and $50) and an ETA in minutes (between 5 and 30). Return ONLY a JSON array of objects with keys: id, name, price, eta, description.`,
    config: {
      responseMimeType: 'application/json',
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [
      { id: '1', name: 'Standard', price: 15.50, eta: 8, description: 'Affordable, everyday rides' },
      { id: '2', name: 'Comfort', price: 22.00, eta: 12, description: 'Newer cars with extra legroom' },
      { id: '3', name: 'Premium', price: 35.00, eta: 15, description: 'Luxury rides with top-rated drivers' },
    ];
  }
}
