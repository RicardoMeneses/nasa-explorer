import { useEffect, useState } from 'react';
import { BsRocketTakeoff } from 'react-icons/bs';

export const LoadingScreen: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const totalTime = 2000;
    const intervalTime = 200;
    const increments = 100 / (totalTime / intervalTime);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + increments;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fixed inset-0 bg-[#0a0f1c] flex flex-col items-center justify-center z-50'>
      <div className='animate-pulse'>
        <BsRocketTakeoff className='h-16 w-16 text-white' />
      </div>
      <h1 className='text-white text-2xl font-bold mt-6 tracking-widest'>Explorador de la NASA</h1>
      <div className='w-64 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden'>
        <div
          className='h-full bg-gradient-to-r from-[#1E3D59] to-[#E31837] rounded-full transition-all duration-300 ease-out'
          style={{ width: `${loadingProgress}%` }}
        >
          <span>{loadingProgress}%</span>
        </div>
      </div>
      <p className='text-gray-400 mt-4'>Cargando datos espaciales...</p>
    </div>
  );
};
