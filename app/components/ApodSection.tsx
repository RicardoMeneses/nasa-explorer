import React, { useEffect, useState } from 'react';

import { FaDownload } from 'react-icons/fa6';
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ApodData {
  date: string;
  title: string;
  url: string;
  hdurl: string;
  explanation: string;
  media_type: string;
  code: number;
  msg: string;
}

interface ApodProps {
  darkMode: boolean;
  dataImage: ApodData | ApodData[];
}

export const ApodSection: React.FC<ApodProps> = ({ darkMode, dataImage }) => {
  const [currentApod, setCurrentApod] = useState(
    Array.isArray(dataImage) ? dataImage[0] : dataImage
  );
  const [showDescription, setShowDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentApod(Array.isArray(dataImage) ? dataImage[0] : dataImage);
  }, [dataImage]);

  const handleDownload = () => {
    window.open(currentApod.hdurl, '_blank');
  };

  const selectApod = (apod: ApodData) => {
    setCurrentApod(apod);
    setShowDescription(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!Array.isArray(dataImage) && dataImage.code === 400) {
    return (
      <section className='relative'>
        <div className='h-screen w-full text-center mx-auto'>
          <div className='flex p-8 justify-center items-center h-full'>
            <h1 className={`text-xl md:text-4xl font-bold tracking-wider text-white mb-4`}>
              No hay imagen disponible, intenta con otra fecha menor.
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='relative'>
      <div
        className='relative h-[500px] md:h-[700px] overflow-hidden w-full md:w-3/4 text-center mx-auto'
        style={{
          backgroundImage: `url(${currentApod.hdurl})`,
          backgroundSize: `${isMobile ? 'cover' : 'contain'}`,
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className='absolute bottom-0 left-0 right-0 p-8 transform translate-y-[-10px] md:translate-y-[-50px]'>
          <h1 className={`text-2xl md:text-6xl font-bold tracking-wider text-white mb-4`}>
            {currentApod.title}
          </h1>
          <p className='text-gray-300 text-sm md:text-lg'>{currentApod.date}</p>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              darkMode ? 'bg-[#0a0f1c67]' : 'bg-white'
            } ${showDescription ? 'max-h-96' : 'max-h-0'}`}
          >
            <div className='max-w-4xl mx-auto p-8'>
              <p
                className={`text-xs md:text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {currentApod.explanation}
              </p>
            </div>
          </div>

          <div className='flex mt-6 space-x-4 text-xs md:text-md'>
            <button
              onClick={handleDownload}
              className='flex items-center px-4 py-2 bg-[#1E3D59] text-white rounded-md hover:bg-opacity-80 transition-colors'
            >
              <FaDownload className='h-5 w-5 mr-2' />
              Descargar
            </button>
            <button
              onClick={() => setShowDescription(!showDescription)}
              className={`flex items-center px-4 py-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${
                darkMode ? 'text-white' : 'text-gray-900'
              } rounded-md hover:bg-opacity-80 transition-colors`}
            >
              {showDescription ? (
                <>
                  <FaChevronUp className='h-5 w-5 mr-2' />
                  Ocultar Descripción
                </>
              ) : (
                <>
                  <FaChevronDown className='h-5 w-5 mr-2' />
                  Ver Descripción
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {Array.isArray(dataImage) ? (
        <div className={`py-12 bg-transparent`}>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className={`text-2xl font-bold mb-6 text-white`}>Imágenes Anteriores</h2>

            <div className='relative'>
              <button
                className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full text-white'
                onClick={() => {
                  const gallery = document.getElementById('apod-gallery');
                  if (gallery) {
                    gallery.scrollLeft -= 300;
                  }
                }}
              >
                <FaChevronLeft className='h-6 w-6' />
              </button>

              <div
                id='apod-gallery'
                className='flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x'
                style={{ scrollBehavior: 'smooth' }}
              >
                {dataImage.map((apod, index) => (
                  <div
                    key={index}
                    className={`flex-none w-72 snap-start cursor-pointer transform transition-transform hover:scale-105 ${
                      currentApod.date === apod.date ? 'ring-4 ring-[#1E3D59]' : ''
                    }`}
                    onClick={() => selectApod(apod)}
                  >
                    <div className='relative h-48 rounded-lg overflow-hidden'>
                      <img src={apod.url} alt={apod.title} className='w-full h-full object-cover' />
                      <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70'></div>
                      <div className='absolute bottom-0 left-0 right-0 p-4'>
                        <h3 className='text-white text-lg font-semibold truncate'>{apod.title}</h3>
                        <p className='text-gray-300 text-sm'>{apod.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 p-2 rounded-full text-white'
                onClick={() => {
                  const gallery = document.getElementById('apod-gallery');
                  if (gallery) {
                    gallery.scrollLeft += 300;
                  }
                }}
              >
                <FaChevronRight className='h-6 w-6' />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
