import { motion, useAnimation, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ClientLogo {
  _id: string;
  imageUrl: string;
}

// LogoSlider Component
interface LogoSliderProps {
  logos: ClientLogo[];
  direction?: number;
  delay?: number;
}

const LogoSlider: React.FC<LogoSliderProps> = ({
  logos,
  direction = 1,
  delay = 0,
}) => {
  if (logos.length === 0) {
    return null;
  }

  // Animation variants for logo items
  const logoItemVariants = {
    hover: {
      scale: 1.15,
      y: -8,
      filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.1))",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 10,
      },
    },
  };

  return (
    <div className="overflow-hidden relative w-full py-4">
      <motion.div
        className="flex items-center"
        initial={{ x: direction > 0 ? "0%" : "-100%" }}
        animate={{
          x: direction > 0 ? ["-100%", "0%"] : ["0%", "-100%"],
        }}
        transition={{
          duration: 35, // Slower for smoother scrolling
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        }}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
        }}
      >
        {/* Rendering the logos twice to create a seamless loop */}
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
          <motion.div
            key={index}
            className="w-56 h-24 flex-shrink-0 flex items-center justify-center mx-8 filter grayscale hover:grayscale-0 transition-all duration-500 ease-out"
            whileHover="hover"
            whileTap="tap"
            variants={logoItemVariants}
          >
            <img
              src={logo.imageUrl}
              alt={`Client ${(index % logos.length) + 1}`}
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150x80?text=Logo";
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ClientsSection = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation controls
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  useEffect(() => {
    let isMounted = true;

    const handleViewChange = async () => {
      if (!isMounted) return;

      if (isInView) {
        await controls.start("visible");
      } else {
        await controls.start("hidden");
      }
    };

    handleViewChange();

    return () => {
      isMounted = false;
      // Properly stop any ongoing animations
      controls.stop();
    };
  }, [controls, isInView]);

  useEffect(() => {
    let isMounted = true;

    const fetchClientLogos = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/client-logo/get-all`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch client logos");
        }

        const data = await response.json();

        if (!isMounted) return;

        if (data.success && Array.isArray(data.data)) {
          setClientLogos(data.data);
        } else {
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching client logos:", err);
        setError("Failed to load client logos");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClientLogos();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fallback logos in case of error or empty response
  const fallbackLogos = [
    {
      _id: "1",
      imageUrl:
        "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
    },
    {
      _id: "2",
      imageUrl:
        "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
    },
    {
      _id: "3",
      imageUrl:
        "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
    },
  ];

  // Only use fallback logos if there's an error and no logos were loaded
  const logosToDisplay =
    clientLogos.length > 0 ? clientLogos : isLoading ? [] : fallbackLogos;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "8rem",
      transition: {
        duration: 1,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.4,
        duration: 0.6,
      },
    },
  };

  const sliderContainerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.6,
        duration: 0.8,
      },
    },
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 0.6,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        duration: 1,
      },
    },
  };

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-4"
          >
            Our Clients
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-1.5 bg-gradient-to-r from-synergy-red to-red-500 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-32"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-synergy-red/20 animate-ping"></div>
              <div className="relative animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-synergy-red"></div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-synergy-red/5 blur-3xl"
        variants={decorationVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-synergy-red/5 blur-3xl"
        variants={decorationVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: 0.3 }}
      />

      {/* Subtle diagonal line decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 -left-96 w-[200%] h-full transform -rotate-6 bg-gradient-to-r from-transparent via-synergy-red/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.h2
            variants={titleVariants}
            className="text-4xl md:text-5xl font-heading font-bold text-synergy-dark mb-4"
          >
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-synergy-red to-red-500">
              Leading Brands
            </span>
          </motion.h2>

          <motion.div
            className="h-1.5 bg-gradient-to-r from-synergy-red to-red-500 mx-auto mb-8 rounded-full"
            variants={lineVariants}
          ></motion.div>

          <motion.p variants={textVariants} className="text-xl text-gray-600">
            We're proud to partner with some of the most renowned brands,
            delivering exceptional results that exceed expectations.
          </motion.p>
        </motion.div>

        {error && logosToDisplay.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 py-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm"
          >
            <p>Unable to load client logos. Please try again later.</p>
            <button
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Re-fetch client logos
                fetch(
                  `${import.meta.env.VITE_BASE_URL}/api/client-logo/get-all`
                )
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success && Array.isArray(data.data)) {
                      setClientLogos(data.data);
                    }
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.error("Error re-fetching client logos:", err);
                    setError("Failed to load client logos");
                    setIsLoading(false);
                  });
              }}
              className="mt-4 px-4 py-2 bg-synergy-red/10 text-synergy-red rounded-md hover:bg-synergy-red/20 transition-colors duration-300"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={sliderContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-20 relative z-10"
          >
            {/* Vertical Decorations */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

            {/* First LogoSlider moving left */}
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              <LogoSlider logos={logosToDisplay} direction={1} delay={0} />
            </div>

            {/* Second LogoSlider moving right */}
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              <LogoSlider logos={logosToDisplay} direction={-1} delay={0.5} />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
