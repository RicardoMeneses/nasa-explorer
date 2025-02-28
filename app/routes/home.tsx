import { ApodSection } from '~/components/ApodSection';
import type { Route } from './+types/home';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '~/components/LoaderScreen';
import { Navbar } from '~/components/NavBar';
import { StarryBackground } from '~/components/StarryBacground';
import { NeoSection } from '~/components/NeoSection';
import { useLoaderData, useNavigation, type LoaderFunction } from 'react-router';
import { BsCalendar2 } from 'react-icons/bs';
import { Modal } from '~/components/Modal';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Explora el Universo | NASA API' },
    {
      name: 'description',
      content:
        'Descubre las maravillas del cosmos. Disfruta de la Imagen Astronómica del Día y conoce los objetos cercanos a la Tierra. Ejercicio de aprendizaje con React Router consumiendo el API de la NASA.',
    },
  ];
}

export interface NeoDataType {
  id: string;
  name: string;
  distance: string;
  diameter: number;
  velocity: string;
  hazardous: boolean;
  date: string;
  orbitClass: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const date = searchParams.get('date');
  const today = format(new Date(), 'yyyy-MM-dd');

  let dataImage, dataNeo;

  if (date) {
    dataImage = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}&date=${date}`
    ).then((res) => res.json());
    dataNeo = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&api_key=${process.env.NASA_KEY}`
    ).then((res) => res.json());
  } else {
    dataImage = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}&count=7`
    ).then((res) => res.json());
    dataNeo = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=${process.env.NASA_KEY}`
    ).then((res) => res.json());
  }

  return Response.json({
    dataImage,
    dataNeo,
  });
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('apod');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const navigation = useNavigation();

  const neoArrayData: NeoDataType[] = [];

  const { dataImage, dataNeo } = useLoaderData();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const neoData = dataNeo.near_earth_objects;
  Object.keys(neoData).map((key) => {
    const neo = neoData[key];
    neo.forEach((element: any) => {
      neoArrayData.push({
        id: element.id,
        name: element.name,
        distance: element.close_approach_data[0].miss_distance.kilometers,
        diameter: element.estimated_diameter.meters.estimated_diameter_max,
        velocity: element.close_approach_data[0].relative_velocity.kilometers_per_hour,
        hazardous: element.is_potentially_hazardous_asteroid,
        date: element.close_approach_data[0].close_approach_date,
        orbitClass: 'Apollo',
      });
    });
  });

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StarryBackground />

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className=' md:hidden pt-20 flex justify-center'>
        <div className='flex items-center'>
          <button
            onClick={toggleModal}
            className={`rounded-full ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white p-2 w-52 flex justify-center items-center gap-3`}
          >
            <BsCalendar2 className='h-4 w-4' /> Selecionar fechas
          </button>
        </div>
      </div>

      <Modal isOpen={isOpenModal} onClose={toggleModal} activeSection={activeSection} />

      <main className='relative z-10 pt-10 md:pt-20'>
        {activeSection === 'apod' && <ApodSection darkMode={darkMode} dataImage={dataImage} />}
        {activeSection === 'neo' && (
          <NeoSection
            darkMode={darkMode}
            neoArrayData={neoArrayData}
            dates={Object.keys(neoData)}
            totalNeos={dataNeo.element_count}
          />
        )}
      </main>

      {navigation.state === 'loading' || navigation.state === 'submitting' ? (
        <LoadingScreen />
      ) : null}
    </>
  );
}
