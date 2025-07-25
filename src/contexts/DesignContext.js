// File: src/contexts/DesignContext.js
import React, { createContext, useState, useContext } from 'react';

const DesignContext = createContext(null);

//quantiy of skimboard should be limited
// default quantity is 1000

export const DesignProvider = ({ children }) => {
  const initialDesignState = {
    _id: null, // Will be generated when added to cart for a specific instance
    name: "My Custom Skimboard", // Default name for a custom design
    boardShape: "classic_oval",
    baseType: "gradient",
    
    solidColor: "#FFFFFF",

    gradientDetails: {
      type: "linear",
      angle: 90,
      stops: [
        { id: 'stop1', offset: 0, color: "#5D091E", opacity: 1 },
        { id: 'stop2', offset: 0.5, color: "#ACE2E0", opacity: 1 },
        { id: 'stop3', offset: 1, color: "#245706", opacity: 1 },
      ],
    },

    customText: {
      text: "Enter text here",
      font: "Arial",
      color: "#696969",
      size: 30,
      alignment: 'center',
      style: 'normal',
      weight: 'normal',
      position: 'centre',
      pos: '35%',
    },
    isTextEnabled: false,

    decal: {
      url: null,
      name: null,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
    },
    isDecalEnabled: false,

    // Placeholder image for custom designs in cart/checkout
    imageUrl: "/customisable-skimboard-icon.png", // ADD THIS LINE (ensure you have this image in public/images)
                                                      // Or use a more generic one like: 'https://picsum.photos/seed/customboard/80/80'

    price: 300.00, // Base price, can be adjusted by features later
    isCustom: true, // Crucial flag for CartContext
  };

  const [currentDesign, setCurrentDesign] = useState(initialDesignState);

  const updateDesign = (newConfig) => {
    setCurrentDesign(prev => ({ ...prev, ...newConfig }));
  };

  const updateGradientStop = (stopId, newStopProps) => {
    setCurrentDesign(prev => ({
        ...prev,
        gradientDetails: {
            ...prev.gradientDetails,
            stops: prev.gradientDetails.stops.map(stop => 
                stop.id === stopId ? { ...stop, ...newStopProps } : stop
            )
        }
    }));
  };
  
  const updateGradientStop2 = (newStopProps) => {
    setCurrentDesign(prev => ({
        ...prev,
        gradientDetails: {
            ...prev.gradientDetails,
            stops: [...newStopProps] // Assumes newStopProps is the full array of stops
        }
    }));
  }

  const addGradientStop = () => {
    setCurrentDesign(prev => {
        const newId = `stop${prev.gradientDetails.stops.length + 1}`;
        const newOffset = prev.gradientDetails.stops.length > 0 
            ? Math.min(1, prev.gradientDetails.stops[prev.gradientDetails.stops.length - 1].offset + 0.2)
            : 0.5;
        return {
            ...prev,
            gradientDetails: {
                ...prev.gradientDetails,
                stops: [
                    ...prev.gradientDetails.stops,
                    { id: newId, offset: newOffset, color: "#CCCCCC", opacity: 1 }
                ].sort((a,b) => a.offset - b.offset)
            }
        };
    });
  };

  const removeGradientStop = (stopId) => {
    setCurrentDesign(prev => ({
        ...prev,
        gradientDetails: {
            ...prev.gradientDetails,
            stops: prev.gradientDetails.stops.filter(stop => stop.id !== stopId)
        }
    }));
  };

  const loadDesign = (designToLoad) => {
    setCurrentDesign({
        ...initialDesignState, 
        ...designToLoad,      
        _id: designToLoad._id || null 
    });
  };

  const resetDesign = () => {
    // When resetting, also reset the local palette in DesignSkimboard if it's not directly tied
    setCurrentDesign({ ...initialDesignState, _id: null });
  };

  const value = {
    currentDesign,
    updateDesign,
    loadDesign,
    updateGradientStop,
    updateGradientStop2,
    addGradientStop,
    removeGradientStop,
    resetDesign,
    initialDesignState // Expose initial state for reset if needed elsewhere
  };

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
};

export const useDesign = () => useContext(DesignContext);