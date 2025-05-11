import React, { useState, useEffect } from 'react';

const palettes = [
  [
    // https://coolors.co/f3a32f-1c3569-f8f9fa-25ced1-177e89
    '#F3A32F',
    '#1C3569',
    '#F8F9FA',
    '#25CED1',
    '#177E89'
  ],
  [
    // https://coolors.co/ceb43d-f2d59d-54998d-336c7f-193266
    '#CEB43D',
    '#F2D59D',
    '#54998D',
    '#336C7F',
    '#193266'
  ],
  [
    // https://coolors.co/app/f8ffe5-1b9aaa-ef476f-ffc43d-32e875
    '#F8FFE5',
    '#1B9AAA',
    '#EF476F',
    '#FFC43D',
    '#32E875'
  ],
  [
    // https://coolors.co/540d6e-ee4266-ffd23f-3bceac-0ead69
    '#540d6e',
    '#ee4266',
    '#ffd23f',
    '#3bceac',
    '#0ead69'
  ],
  [
    // https://coolors.co/231942-5e548e-9f86c0-be95c4-e0b1cb
    '#231942',
    '#5e548e',
    '#9f86c0',
    '#be95c4',
    '#e0b1cb'
  ],
  [
    // https://coolors.co/app/270722-e01a4f-f3b61f-f7d488-d3fad6
    '#270722',
    '#e01a4f',
    '#f3b61f',
    '#f7d488',
    '#d3fad6'
  ],
  [
    // https://coolors.co/app/0077bb-e5f9e0-a3f7b5-40c9a2-664147
    '#0077bb',
    '#e5f9e0',
    '#a3f7b5',
    '#40c9a2',
    '#664147'
  ],
  [
    // https://coolors.co/006e90-70cad1-d7fdec-a9fbd7-73eedc
    '#006e90',
    '#70cad1',
    '#d7fdec',
    '#a9fbd7',
    '#73eedc'
  ],
  [
    // https://coolors.co/app/f5f4f2-feedf3-feb4c1-cd3c67-3f3f3f
    '#F5F4F2',
    '#feedf3',
    '#feb4c1',
    '#cd3c67',
    '#3f3f3f'
  ],
  [
    // https://coolors.co/f7bb93-dc846e-e9dbd4-ebc2b6-f8f1e2
    '#f7bb93',
    '#dc846e',
    '#e9dbd4',
    '#ebc2b6',
    '#f8f1e2'
  ],
  [
    // https://coolors.co/app/003049-d62828-f77f00-fcbf49-eae2b7
    '#003049',
    '#d62828',
    '#f77f00',
    '#fcbf49',
    '#eae2b7'
  ],
  [
    // https://coolors.co/app/bce784-5dd39e-348aa7-525174-513b56
    '#bce784',
    '#5dd39e',
    '#348aa7',
    '#525174',
    '#513b56'
  ],
  [
    // https://coolors.co/app/000000-2f4550-586f7c-b8dbd9-f4f4f9
    '#000000',
    '#2f4550',
    '#586f7c',
    '#b8dbd9',
    '#f4f4f9'
  ],
  [
    // https://coolors.co/app/040f0f-248232-2ba84a-2d3a3a-fcfffc
    '#040f0f',
    '#248232',
    '#2ba84a',
    '#2d3a3a',
    '#fcfffc'
  ],
  [
    // https://coolors.co/1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d
    '#1a535c',
    '#4ecdc4',
    '#f7fff7',
    '#ff6b6b',
    '#ffe66d'
  ],
  [
    // https://coolors.co/05668d-427aa1-ebf2fa-679436-a5be00
    '#05668d',
    '#427aa1',
    '#ebf2fa',
    '#679436',
    '#a5be00'
  ],
  [
    // https://coolors.co/000000-5d737e-fff07c-f0f7ee-87bba2
    '#000000',
    '#5d737e',
    '#fff07c',
    '#f0f7ee',
    '#87bba2'
  ],
  [
    // https://coolors.co/app/00467f-00072d-008ecd-a6e1fa-00072d
    '#00467f',
    '#00072d',
    '#008ecd',
    '#a6e1fa',
    '#00072d'
  ],
  [
    // https://coolors.co/app/fff75a-fffd98-8693ab-96adc8-c4cad0
    '#fff75a',
    '#fffd98',
    '#8693ab',
    '#96adc8',
    '#c4cad0'
  ],
  [
    // https://coolors.co/app/447604-85cb33-9ffcdf-52ad9c-3c1b43
    '#447604',
    '#85cb33',
    '#9ffcdf',
    '#52ad9c',
    '#3c1b43'
  ],
  [
    // https://coolors.co/app/215a72-3e95ad-f5ee9e-f49e4c-ab3428
    '#215a72',
    '#3e95ad',
    '#f5ee9e',
    '#f49e4c',
    '#ab3428'
  ],
  [
    // https://coolors.co/app/a8f9ff-ffffff-56cbf9-ffe74c-ff729f
    '#a8f9ff',
    '#ffffff',
    '#56cbf9',
    '#ffe74c',
    '#ff729f'
  ],
  [
    // https://coolors.co/app/f2dd6e-f2a359-e5b25d-b87d4b-523a34
    '#f2dd6e',
    '#f2a359',
    '#e5b25d',
    '#b87d4b',
    '#523a34'
  ]
];

// Circle component with animation
const Circle = ({ x, y, radius, fill, opacity = 0.8, hasBorder, borderWidth, borderColor, rotation = 0, delay, driftSpeed, driftAngle }) => {
  const [animated, setAnimated] = useState(false);
  const [position, setPosition] = useState({ x, y });
  
  // Initial appearance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Drifting animation
  useEffect(() => {
    if (!animated) return;
    
    // Calculate velocity components based on angle and speed
    const vx = Math.cos(driftAngle) * driftSpeed;
    const vy = Math.sin(driftAngle) * driftSpeed;
    
    const driftInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + vx,
        y: prev.y + vy
      }));
    }, 50); // Update position every 50ms
    
    return () => clearInterval(driftInterval);
  }, [animated, driftSpeed, driftAngle]);
  
  // For rotation, we need to create a group and apply the transform
  return (
    <g transform={`rotate(${rotation} ${position.x} ${position.y})`}>
      <circle
        cx={position.x}
        cy={position.y}
        r={animated ? radius : 0}
        fill={fill}
        opacity={animated ? opacity : 0}
        stroke={hasBorder ? borderColor : "none"}
        strokeWidth={hasBorder ? borderWidth : 0}
        style={{
          transition: `opacity 0.8s ease-out ${delay}ms, r 0.8s ease-out ${delay}ms`
        }}
      />
    </g>
  );
};

// Main Circlescape component
const Circlescape = () => {
  const [circles, setCircles] = useState([]);
  const [minCircles, setMinCircles] = useState(20);
  const [maxCircles, setMaxCircles] = useState(50);
  const [interval, setInterval] = useState(3);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - 200 : 600
  });

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - 200
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate a random number between min and max
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Generate circles
  const generateCircles = () => {
    // Randomly select a palette for each new generation
    const newPaletteIndex = random(0, palettes.length - 1);
    setSelectedPalette(newPaletteIndex);
    
    const currentPalette = palettes[newPaletteIndex];
    const numCircles = random(minCircles, maxCircles);
    const maxRadius = Math.min(windowSize.width, windowSize.height) / 10;
    
    const newCircles = Array.from({ length: numCircles }, (_, index) => {
      const radius = random(5, maxRadius);
      const hasBorder = Math.random() > 0.5; // 50% chance of having a border
      
      return {
        x: random(radius, windowSize.width - radius),
        y: random(radius, windowSize.height - radius),
        radius,
        fill: currentPalette[random(0, currentPalette.length - 1)],
        opacity: Math.random() * 0.8 + 0.2, // Between 0.2 and 1
        rotation: random(0, 360), // Random rotation 0-360 degrees
        hasBorder,
        borderWidth: hasBorder ? random(1, 4) : 0, // Border thickness between 1-4px
        borderColor: hasBorder ? currentPalette[random(0, currentPalette.length - 1)] : 'none',
        delay: index * (1000 / numCircles), // Stagger the animation based on index
        driftSpeed: (Math.random() * 0.3) + 0.1, // Random drift speed between 0.1 and 0.4 pixels per frame
        driftAngle: Math.random() * Math.PI * 2 // Random angle in radians (0 to 2π)
      };
    });
    
    setCircles(newCircles);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle auto-generation with interval
  useEffect(() => {
    let timer;
    
    if (isPlaying) {
      generateCircles(); // Generate immediately when play is pressed
      timer = setInterval(generateCircles, interval * 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, interval, selectedPalette, minCircles, maxCircles, windowSize]);

  // Handle palette change
  const handlePaletteChange = (e) => {
    setSelectedPalette(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full p-4 bg-gray-100 rounded-lg mb-4">
        <div className="flex flex-wrap justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Min Circles:</label>
            <input 
              type="number" 
              value={minCircles} 
              onChange={(e) => setMinCircles(Math.max(1, parseInt(e.target.value)))}
              className="px-2 py-1 border rounded w-24"
              min="1"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Max Circles:</label>
            <input 
              type="number" 
              value={maxCircles} 
              onChange={(e) => setMaxCircles(Math.max(minCircles, parseInt(e.target.value)))}
              className="px-2 py-1 border rounded w-24"
              min={minCircles}
            />
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Interval (seconds):</label>
            <input 
              type="number" 
              value={interval} 
              onChange={(e) => setInterval(Math.max(0.5, parseFloat(e.target.value)))}
              className="px-2 py-1 border rounded w-24"
              min="0.5"
              step="0.5"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Color Palette:</label>
            <select 
              value={selectedPalette} 
              onChange={handlePaletteChange}
              className="px-2 py-1 border rounded"
              disabled={isPlaying}
            >
              {palettes.map((_, index) => (
                <option key={index} value={index}>Palette {index + 1}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500 mt-1">
              {isPlaying ? "Randomized during play" : "Manual selection"}
            </span>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={togglePlay}
              className={`px-4 py-2 font-medium rounded ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button 
              onClick={generateCircles}
              className="px-4 py-2 ml-2 font-medium text-white bg-blue-500 rounded"
              disabled={isPlaying}
            >
              Generate Once
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Current Palette:</span>
          <div className="flex">
            {palettes[selectedPalette].map((color, index) => (
              <div 
                key={index} 
                style={{ backgroundColor: color }} 
                className="w-6 h-6 border border-gray-300"
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="border rounded w-full">
        <svg width={windowSize.width} height={windowSize.height}>
          <rect width={windowSize.width} height={windowSize.height} fill="#f8f8f8" />
          {circles.map((circle, index) => (
            <Circle 
              key={index} 
              x={circle.x} 
              y={circle.y} 
              radius={circle.radius} 
              fill={circle.fill}
              opacity={circle.opacity}
              rotation={circle.rotation}
              hasBorder={circle.hasBorder}
              borderWidth={circle.borderWidth}
              borderColor={circle.borderColor}
              delay={circle.delay}
              driftSpeed={circle.driftSpeed}
              driftAngle={circle.driftAngle}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Circlescape;