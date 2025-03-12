import { motion } from "framer-motion";

// Sample client logos - replace with actual logo URLs
const clientLogos = [
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
  "https://www.vhv.rs/dpng/d/560-5604430_adani-logo-transparent-hd-png-download.png",
 
];

// LogoSlider Component
const LogoSlider = ({ direction = 1 }) => {
  return (
    <div className="overflow-hidden relative w-full">
      <motion.div
        className="flex items-center"
        animate={{
          x: direction > 0 ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{
          duration: 20, // Adjust speed for smooth scrolling
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
        }}
      >
        {/* Rendering the logos twice to create a seamless loop */}
        {[...clientLogos, ...clientLogos].map((logo, index) => (
          <div key={index} className="w-32 h-16 flex-shrink-0 flex items-center justify-center mx-4">
            <img
              src={logo}
              alt={`Client ${index % clientLogos.length + 1}`}
              className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ClientsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-synergy-dark mb-4">Our Clients</h2>
          <div className="w-20 h-1 bg-synergy-red mx-auto mb-6"></div>
          <p className="text-lg text-gray-600">
            We're proud to partner with some of the most renowned brands in the world, delivering exceptional results together.
          </p>
        </div>
        <div className="space-y-12">
          {/* First LogoSlider moving left */}
          <LogoSlider direction={1} />
          {/* Second LogoSlider moving right */}
          <LogoSlider direction={-1} />
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
