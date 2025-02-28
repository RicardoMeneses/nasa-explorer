import { useState } from 'react';
import { FaRegMoon } from 'react-icons/fa6';
import { IoMdSunny } from 'react-icons/io';
import { IoSearchOutline, IoMenu, IoClose } from 'react-icons/io5';

import { NasaLogo } from './Logo';
import { Modal } from './Modal';
import { BsCalendar2 } from 'react-icons/bs';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  toggleDarkMode,
  activeSection,
  setActiveSection,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        darkMode ? 'bg-[#0a0f1c]/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <NasaLogo darkMode={darkMode} />
            </div>
            <div className='hidden md:block'>
              <div className='ml-10 flex items-center space-x-4'>
                <button
                  onClick={() => setActiveSection('apod')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeSection === 'apod'
                      ? 'bg-[#1E3D59] text-white'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Imagen Astronómica del Día
                </button>
                <button
                  onClick={() => setActiveSection('neo')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeSection === 'neo'
                      ? 'bg-[#1E3D59] text-white'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Objetos Cercanos a la Tierra
                </button>
              </div>
            </div>
          </div>

          <div className='hidden md:block'>
            <div className='flex items-center'>
              <button
                onClick={toggleModal}
                className={`rounded-full ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white p-2 w-52 flex justify-center items-center gap-3`}
              >
                <BsCalendar2 className='h-4 w-4' /> Selecionar fechas
              </button>

              <Modal isOpen={isOpenModal} onClose={toggleModal} activeSection={activeSection} />
            </div>
          </div>
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white`}
            >
              <span className='sr-only'>Open main menu</span>
              {isMenuOpen ? (
                <IoClose className='block h-6 w-6' />
              ) : (
                <IoMenu className='block h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className='md:hidden'>
          <div
            className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${darkMode ? 'bg-[#0a0f1c]' : 'bg-white'}`}
          >
            <button
              onClick={() => {
                setActiveSection('apod');
                setIsMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                activeSection === 'apod'
                  ? 'bg-[#1E3D59] text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Imagen Astronómica del Día
            </button>
            <button
              onClick={() => {
                setActiveSection('neo');
                setIsMenuOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                activeSection === 'neo'
                  ? 'bg-[#1E3D59] text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Objetos Cercanos a la Tierra
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
