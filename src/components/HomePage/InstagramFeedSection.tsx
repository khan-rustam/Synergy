import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    instgrm?: any;
  }
}

const InstagramFeedSection: React.FC = () => {
  useEffect(() => {
    const loadInstagramEmbed = () => {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = '//www.instagram.com/embed.js';
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process();
        }
      };
      document.body.appendChild(script);
    };

    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      loadInstagramEmbed();
    }
  }, []);

  return (
    <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Follow Us on Instagram</h2>
          <p className="text-gray-600 text-lg">Stay connected with our latest updates and stories</p>
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Instagram Embed */}
          <div className="instagram-embed-container p-4 bg-white rounded-xl shadow-lg  transition-transform duration-300 transform-gpu">
            <iframe
              src="https://www.instagram.com/synergy_ooh/embed"
              className="w-full aspect-[5/6] border-none overflow-hidden"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <a
            href="https://www.instagram.com/synergy_ooh/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 text-lg border border-transparent font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View Our Instagram Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstagramFeedSection;
