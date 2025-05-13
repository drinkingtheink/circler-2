import React, { useState, useEffect, useCallback, useMemo } from 'react';
import palettes from './data/palettes';
import './CirclescapeStyles.css';
import logo from './logo.svg';

// Circle component with animation
const Circle = ({ x, y, radius, fill, opacity = 0.8, hasBorder, borderWidth, borderColor, borderStyle, dashPattern, rotation = 0, delay, driftSpeed, driftAngle, hasShadow }) => {
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
  
  // Generate a unique transition delay for this circle
  const transitionDelay = useMemo(() => (Math.random() * 0.5 + 0.2).toFixed(2), []);
  
  // Generate a unique transition duration for this circle
  const transitionDuration = useMemo(() => (Math.random() * 0.5 + 0.5).toFixed(2), []);
  
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
        strokeDasharray={borderStyle === 'dotted' ? dashPattern : ''}
        style={{
          transition: `
            opacity 0.8s ease-out ${delay}ms, 
            r 0.8s ease-out ${delay}ms,
            fill ${transitionDuration}s ease-in-out ${transitionDelay}s,
            stroke ${transitionDuration}s ease-in-out ${transitionDelay}s
          `
        }}
        className={hasShadow ? 'has-shadow' : null}
      />
    </g>
  );
};

// Main Circlescape component
const Circlescape = () => {
  const [circles, setCircles] = useState([]);
  const [minCircles, setMinCircles] = useState(10);
  const [maxCircles, setMaxCircles] = useState(30);
  const [lockedCount, setLockedCount] = useState(false);
  const [exactCircleCount, setExactCircleCount] = useState(35);
  const [currentCircleCount, setCurrentCircleCount] = useState(0);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [canvasBackground, setCanvasBackground] = useState('#f8f8f8');
  const [timeInterval, setTimeInterval] = useState(10);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - 200 : 600
  });

  // Update window size on resize
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateWindowSize(); // Initial size update
    window.addEventListener('resize', updateWindowSize);
    
    // Update again after a small delay to ensure accurate measurements after DOM updates
    const resizeTimer = setTimeout(updateWindowSize, 100);
    
    return () => {
      window.removeEventListener('resize', updateWindowSize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Generate a random number between min and max
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Random dash pattern generator
  const generateDashPattern = () => {
    const dashLength = Math.floor(Math.random() * 15) + 2; // Between 2 and 16
    const gapLength = Math.floor(Math.random() * 10) + 2; // Between 2 and 11
    return `${dashLength} ${gapLength}`;
  };

  // Memoize generateCircles to prevent infinite loops in useEffect
  const memoizedGenerateCircles = useCallback(() => {
    // Randomly select a palette for each new generation
    const newPaletteIndex = random(0, palettes.length - 1);
    setSelectedPalette(newPaletteIndex);
    
    const currentPalette = palettes[newPaletteIndex];
    // Select a random background color from the palette
    const bgColorIndex = random(0, currentPalette.length - 1);
    const newBgColor = currentPalette[bgColorIndex];
    // Apply a high opacity to the background for a subtle effect
    const bgOpacity = 0.7;
    
    // Convert hex to rgba for background
    const hexToRgba = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    setCanvasBackground(hexToRgba(newBgColor, bgOpacity));
    
    // Use exact count if locked, otherwise random between min and max
    const numCircles = lockedCount ? exactCircleCount : random(minCircles, maxCircles);
    setCurrentCircleCount(numCircles); // Update the current count display
    
    const maxRadius = Math.min(windowSize.width, windowSize.height) / 3.5;
    
    const newCircles = Array.from({ length: numCircles }, (_, index) => {
      const radius = random(5, maxRadius);
      const hasBorder = Math.random() > 0.5; // 50% chance of having a border
      const hasShadow = Math.random() > 0.7; // 30% chance of having a shadow
      const borderStyle = hasBorder ? (Math.random() > 0.85 ? 'dotted' : 'solid') : 'none'; // 15% chance of dotted border if has border
      const dashPattern = borderStyle === 'dotted' ? generateDashPattern() : '';
      
      return {
        x: random(radius, windowSize.width - radius + 100),
        y: random(radius, windowSize.height - radius + 100),
        radius,
        fill: currentPalette[random(0, currentPalette.length - 1)],
        opacity: Math.random() * 0.8 + 0.2, // Between 0.2 and 1
        rotation: random(0, 360), // Random rotation 0-360 degrees
        hasBorder,
        borderWidth: hasBorder ? random(1, 40) : 0, // Border thickness
        borderColor: hasBorder ? currentPalette[random(0, currentPalette.length - 1)] : 'none',
        borderStyle,
        dashPattern,
        delay: index * (1000 / numCircles), // Stagger the animation based on index
        driftSpeed: (Math.random() * 0.3) + 0.1, // Random drift speed between 0.1 and 0.4 pixels per frame
        driftAngle: Math.random() * Math.PI * 2, // Random angle in radians (0 to 2π)
        hasShadow
      };
    });
    
    setCircles(newCircles);
  }, [exactCircleCount, lockedCount, minCircles, maxCircles, windowSize]);
  
  // Alias for the memoized function to use throughout the component
  const generateCircles = memoizedGenerateCircles;

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Initial generation on mount
  useEffect(() => {
    // Generate first circlescape after component mounts
    memoizedGenerateCircles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle keyboard events (spacebar for generation)
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Generate new circles when space bar is pressed
      if (event.code === 'Space' || event.key === ' ') {
        // Prevent default space bar action (scrolling)
        event.preventDefault();
        
        // Only generate if not in playing mode
        if (!isPlaying) {
          generateCircles();
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, generateCircles]);

  // Handle auto-generation with interval
  useEffect(() => {
    let timer;
    
    if (isPlaying) {
      // Generate immediately when play is pressed
      generateCircles();
      
      // Set up timer for regular generation using the renamed variable
      timer = window.setInterval(() => {
        generateCircles();
      }, timeInterval * 1000);
      
      console.log(`Entertain Mode active: Generating new circlescape every ${timeInterval} seconds`);
    }
    
    // Clean up timer when component unmounts or play state changes
    return () => {
      if (timer) {
        console.log('Clearing interval timer');
        window.clearInterval(timer);
      }
    };
  }, [isPlaying, timeInterval, generateCircles]);

  // Update colors when palette changes
  const updatePaletteColors = useCallback((newPaletteIndex) => {
    // Only proceed if we have circles to update
    if (circles.length === 0) return;
    
    const newPalette = palettes[newPaletteIndex];
    
    // Update background color
    const bgColorIndex = random(0, newPalette.length - 1);
    const newBgColor = newPalette[bgColorIndex];
    
    // Convert hex to rgba for background
    const hexToRgba = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    setCanvasBackground(hexToRgba(newBgColor, 0.7));
    
    // Update colors of existing circles with new palette
    setCircles(prevCircles => prevCircles.map(circle => {
      // Get a random color from the new palette
      const newFill = newPalette[random(0, newPalette.length - 1)];
      
      // Get a random color for the border if this circle has one
      const newBorderColor = circle.hasBorder ? 
                            newPalette[random(0, newPalette.length - 1)] : 
                            'none';
      
      // Retain all other properties, just update the colors
      return {
        ...circle,
        fill: newFill,
        borderColor: newBorderColor
      };
    }));
  }, [circles]);
  
  // Handle palette change
  const handlePaletteChange = (e) => {
    const newPaletteIndex = Number(e.target.value);
    setSelectedPalette(newPaletteIndex);
    updatePaletteColors(newPaletteIndex);
  };
  
  // Direct palette selection from preview
  const selectPalette = (index) => {
    if (isPlaying) return; // Don't allow changes while playing
    setSelectedPalette(index);
    updatePaletteColors(index);
  };

  return (
    <div className="circlescape-container">
      <div className={`sidebar-menu ${menuCollapsed ? 'collapsed' : ''}`}>
        <div className="menu-header">
          {menuCollapsed ? null : <h2 className="app-title"><img className="logo" src={logo} /> The Circler</h2>}
          <button 
            className="collapse-toggle" 
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            title={menuCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {menuCollapsed ? '›' : '‹'}
          </button>
        </div>

        <div className="menu-content">
          <div className="control-section">
            <h3 className="section-title">Circlescape Config</h3>
            <div className="control-group">
              <div className="toggle-container">
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    checked={lockedCount} 
                    onChange={() => setLockedCount(!lockedCount)} 
                  />
                  <span className="toggle-text">{lockedCount ? "Exact Count" : "Range"}</span>
                </label>
              </div>
              
              {lockedCount ? (
                <div className="exact-count-control">
                  <label>Number:</label>
                  <input 
                    type="number" 
                    value={exactCircleCount} 
                    onChange={(e) => setExactCircleCount(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                  />
                </div>
              ) : (
                <div className="range-count-control">
                  <div className="min-max-inputs">
                    <div>
                      <label>Min:</label>
                      <input 
                        type="number" 
                        value={minCircles} 
                        onChange={(e) => setMinCircles(Math.max(1, parseInt(e.target.value)))}
                        min="1"
                      />
                    </div>
                    <div>
                      <label>Max:</label>
                      <input 
                        type="number" 
                        value={maxCircles} 
                        onChange={(e) => setMaxCircles(Math.max(minCircles, parseInt(e.target.value)))}
                        min={minCircles}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="control-group">
              <label>ENTERTAIN MODE: Change scene every (sec):</label>
              <input 
                type="number" 
                value={timeInterval} 
                onChange={(e) => setTimeInterval(Math.max(0.5, parseFloat(e.target.value)))}
                min="0.5"
                step="0.5"
              />
            </div>
          </div>
          
          <div className="control-section">
            <h3 className="section-title">Appearance</h3>

            {isPlaying ? null : 
                <div className="control-group">
                  <label>Select Color Palette:</label>
                  <div className="palette-select-container">
                    <select 
                      value={selectedPalette} 
                      onChange={handlePaletteChange}
                      disabled={isPlaying}
                      className="palette-select"
                    >
                      {palettes.map((palette, index) => (
                        <option key={index} value={index} className="palette-option-item">
                          Palette {index + 1}
                        </option>
                      ))}
                    </select>
                    <div className="palette-preview-dropdown">
                      {palettes.map((palette, index) => (
                        <div 
                          key={index}
                          className={`palette-preview-item ${index === selectedPalette ? 'active' : ''}`}
                          onClick={() => !isPlaying && selectPalette(index)}
                        >
                          <div className="palette-colors">
                            {palette.map((color, colorIndex) => (
                              <div 
                                key={colorIndex} 
                                className="palette-color-sample" 
                                style={{ backgroundColor: color }} 
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            }

            <span className="palette-note">
              {isPlaying ? "Randomized during Entertain Mode" : "Active palette"}
            </span>
            
            <div className="current-palette-preview">
              <div className="color-squares">
                {palettes[selectedPalette].map((color, index) => (
                  <div 
                    key={index} 
                    style={{ backgroundColor: color }} 
                    className="color-square"
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="controls-footer">
            <div className="button-row">
              <button 
                onClick={togglePlay}
                className={isPlaying ? 'pause-button' : 'play-button'}
              >
                {isPlaying ? 'Pause' : 'Entertain Mode'}
              </button>
              
              <button 
                onClick={generateCircles}
                className="generate-button"
                disabled={isPlaying}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="canvas-wrapper">
        <section class="config-display">
          <img className="logo" src={logo} />
         
         {isPlaying ? <div className="circle-count-display"><span class="party-mode-indicator">Entertain Mode Enabled</span></div> : <div className="keyboard-hint"><span>Press <kbd>Space</kbd> to generate</span></div>}

          <div className="circle-count-display">
            <span>Circle count: </span>
            <strong>{currentCircleCount}</strong>
          </div>
        </section>
        <svg width={windowSize.width} height={windowSize.height}>
          <rect width={windowSize.width} height={windowSize.height} fill={canvasBackground} />
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
              borderStyle={circle.borderStyle}
              dashPattern={circle.dashPattern}
              delay={circle.delay}
              driftSpeed={circle.driftSpeed}
              driftAngle={circle.driftAngle}
              hasShadow={circle.hasShadow}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Circlescape;