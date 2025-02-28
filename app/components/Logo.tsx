import React from 'react';
import { BsRocketTakeoff } from 'react-icons/bs';

interface NasaLogoProps {
  darkMode: boolean;
}

export const NasaLogo: React.FC<NasaLogoProps> = ({ darkMode }) => {
  return (
    <div className='flex items-center'>
      <BsRocketTakeoff className={`h-8 w-8 ${darkMode ? 'text-white' : 'text-[#1E3D59]'}`} />
      <span
        className={`ml-2 text-xl font-bold tracking-wider ${
          darkMode ? 'text-white' : 'text-[#1E3D59]'
        }`}
      >
        Exporador de la NASA
      </span>
    </div>
  );
};
