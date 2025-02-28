import { useEffect, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useSearchParams } from 'react-router';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export const Modal = ({ isOpen, onClose, activeSection }: ModalProps) => {
  if (!isOpen) return null;

  const [, setDateParams] = useSearchParams();
  const [date, setDate] = useState<Date>();

  const handleCleanDates = () => {
    setDateParams({});
  };

  useEffect(() => {
    if (date) {
      setDateParams({
        date: format(date, 'yyyy-MM-dd'),
      });

      onClose();
    }
  }, [date]);

  return (
    <div className='fixed h-screen w-screen  inset-0 backdrop-blur-lg flex justify-center items-center p-4 z-40'>
      <div className='bg-[#1E3D59] p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center'>
        <h2 className='text-xl font-bold mb-4 text-white'>
          {activeSection === 'apod' ? 'Seleccionar fecha' : 'Seleccionar rango de fechas'}
        </h2>

        <DayPicker
          mode='single'
          selected={date}
          onSelect={setDate}
          locale={es}
          className='mb-4 text-white flex justify-center'
          required
          classNames={{
            day: 'text-white',
          }}
          components={{}}
          showOutsideDays
        />

        <button onClick={onClose} className='cursor-pointer mr-10'>
          Cerrar
        </button>
        <button className='cursor-pointer' onClick={handleCleanDates}>
          Limpiar fecha
        </button>
      </div>
    </div>
  );
};
