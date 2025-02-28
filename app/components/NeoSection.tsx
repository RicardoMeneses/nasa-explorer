import React, { useState, useEffect, useRef } from 'react';

import { FaRegCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { CiFilter } from 'react-icons/ci';
import type { NeoDataType } from '~/routes/home';

interface NeoProps {
  darkMode: boolean;
  neoArrayData: NeoDataType[];
  dates: string[];
  totalNeos: number;
}

export const NeoSection: React.FC<NeoProps> = ({ darkMode, neoArrayData, dates, totalNeos }) => {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedNeo, setSelectedNeo] = useState(neoArrayData[0]);
  const [filteredNeos, setFilteredNeos] = useState(
    neoArrayData.filter((neo) => neo.date === selectedDate)
  );
  const [filterHazardous, setFilterHazardous] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let filtered = neoArrayData.filter((neo) => neo.date === selectedDate);

    if (filterHazardous !== null) {
      filtered = filtered.filter((neo) => neo.hazardous === filterHazardous);
    }

    setFilteredNeos(filtered);

    if (filtered.length > 0 && !filtered.some((neo) => neo.id === selectedNeo.id)) {
      setSelectedNeo(filtered[0]);
    }
  }, [selectedDate, filterHazardous, selectedNeo.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const earth = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 40,
    };

    const neoObjects = filteredNeos.map((neo, index) => {
      const distance = 80 + (Number(neo.distance) / 1000000) * 20;
      const angle = (index * (2 * Math.PI)) / filteredNeos.length;

      return {
        ...neo,
        x: earth.x + Math.cos(angle) * distance,
        y: earth.y + Math.sin(angle) * distance,
        radius: 5 + neo.diameter / 100,
        angle,
        orbitRadius: distance,
        selected: neo.id === selectedNeo.id,
        animationOffset: Math.random() * Math.PI * 2,
      };
    });

    let rotation = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.005;

      const gradient = ctx.createRadialGradient(
        earth.x,
        earth.y,
        0,
        earth.x,
        earth.y,
        canvas.width / 1.5
      );
      gradient.addColorStop(0, 'rgba(30, 61, 89, 0.2)');
      gradient.addColorStop(1, 'rgba(10, 15, 28, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      neoObjects.forEach((neo) => {
        ctx.beginPath();
        ctx.arc(earth.x, earth.y, neo.orbitRadius, 0, Math.PI * 2);
        ctx.strokeStyle = neo.selected ? 'rgba(227, 24, 55, 0.6)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = neo.selected ? 2 : 1;
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1E3D59';
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Tierra', earth.x, earth.y);

      // Draw a simple atmosphere
      ctx.beginPath();
      ctx.arc(earth.x, earth.y, earth.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw NEOs
      neoObjects.forEach((neo) => {
        // Update position with rotation
        const currentAngle = neo.angle + rotation + neo.animationOffset;
        const x = earth.x + Math.cos(currentAngle) * neo.orbitRadius;
        const y = earth.y + Math.sin(currentAngle) * neo.orbitRadius;

        // Draw NEO
        ctx.beginPath();
        ctx.arc(x, y, neo.radius, 0, Math.PI * 2);
        ctx.fillStyle = neo.hazardous ? 'rgba(227, 24, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';

        // Highlight selected NEO
        if (neo.selected) {
          ctx.shadowColor = neo.hazardous ? '#E31837' : '#FFFFFF';
          ctx.shadowBlur = 15;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw selection indicator
        if (neo.selected) {
          ctx.beginPath();
          ctx.arc(x, y, neo.radius + 8, 0, Math.PI * 2);
          ctx.strokeStyle = neo.hazardous ? '#E31837' : '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw line to info card
          const cardX = canvas.width - 300;
          const cardY = canvas.height / 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(cardX, cardY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [filteredNeos, selectedNeo.id, darkMode]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <section className={`min-h-screen ${darkMode ? 'bg-transparent' : 'bg-gray-100'}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-12'>
        <h1
          className={`text-2xl md:text-4xl font-bold mb-8 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {totalNeos} Objetos Cercanos a la Tierra
        </h1>

        {/* Controls */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <div
            className={`flex items-center p-2 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <FaRegCalendarAlt
              className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`bg-transparent border-none focus:ring-0 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`flex items-center p-2 rounded-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <CiFilter className={`h-5 w-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={filterHazardous === null ? 'all' : filterHazardous ? 'hazardous' : 'safe'}
              onChange={(e) => {
                if (e.target.value === 'all') setFilterHazardous(null);
                else if (e.target.value === 'hazardous') setFilterHazardous(true);
                else setFilterHazardous(false);
              }}
              className={`bg-transparent border-none focus:ring-0 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <option value='all'>Todos los objetos</option>
              <option value='hazardous'>Potencialmente peligrosos</option>
              <option value='safe'>No peligrosos</option>
            </select>
          </div>
        </div>

        {/* Main content area */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* 3D Visualization */}
          <div className='lg:w-2/3 relative'>
            <canvas ref={canvasRef} className='w-full h-[500px] rounded-xl' />

            {/* Object list below visualization */}
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 gap-4'>
              {filteredNeos.map((neo) => (
                <div
                  key={neo.id}
                  onClick={() => setSelectedNeo(neo)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                    selectedNeo.id === neo.id
                      ? neo.hazardous
                        ? 'bg-[#E31837] bg-opacity-20 border-2 border-[#E31837]'
                        : 'bg-[#1E3D59] bg-opacity-20 border-2 border-[#1E3D59]'
                      : darkMode
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center'>
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        neo.hazardous ? 'bg-[#E31837]' : 'bg-green-500'
                      }`}
                    ></div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {neo.name}
                    </h3>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatNumber(Number(neo.distance))} km
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected NEO details */}
          <div className='lg:w-1/3'>
            <div
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg border-l-4 ${
                selectedNeo.hazardous ? 'border-[#E31837]' : 'border-green-500'
              }`}
            >
              <div className='flex justify-between items-start mb-4'>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedNeo.name}
                </h2>
                {selectedNeo.hazardous && (
                  <span className='px-2 py-1 bg-[#E31837] text-white text-xs font-semibold rounded-full'>
                    Potencialmente Peligroso
                  </span>
                )}
              </div>

              <div className='space-y-4'>
                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Distancia a la Tierra
                  </h3>
                  <p
                    className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {formatNumber(Number(selectedNeo.distance))} km
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Diámetro Estimado
                  </h3>
                  <p
                    className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {selectedNeo.diameter} metros
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Velocidad Relativa
                  </h3>
                  <p
                    className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {formatNumber(Number(selectedNeo.velocity))} km/h
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Clase Orbital
                  </h3>
                  <p
                    className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {selectedNeo.orbitClass}
                  </p>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className='flex items-start'>
                  <FaInfoCircle
                    className={`h-5 w-5 mr-2 mt-0.5 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  />
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Los objetos cercanos a la Tierra (NEO) son asteroides o cometas cuyas órbitas
                    los acercan a la Tierra.
                    {selectedNeo.hazardous
                      ? ' Este objeto está clasificado como potencialmente peligroso debido a su tamaño y proximidad a la Tierra.'
                      : ' Este objeto no representa ningún peligro para la Tierra en su trayectoria actual.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
