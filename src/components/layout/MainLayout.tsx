import { ReactNode, useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Loader from '../common/Loader';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after content is ready
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Minimum loading time of 1 second

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-body min-h-screen flex flex-col">
      <Loader fullScreen={true} showText={true} isLoading={isLoading} />
      <div className={`flex-1 flex flex-col ${isLoading ? 'invisible' : 'visible'}`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  );
};

export default MainLayout; 