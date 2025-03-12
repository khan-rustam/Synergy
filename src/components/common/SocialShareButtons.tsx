import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

/**
 * SocialShareButtons Component
 * Displays animated social share buttons for blog posts
 */
const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ title, url }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll to show/hide social buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300); // Show after 300px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Share handlers
  const handleShare = (platform: string) => {
    const shareText = `Check out this article: ${title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
      return;
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('facebook')}
            className="bg-blue-600 p-3 rounded-full text-white shadow-lg hover:shadow-blue-500/50 transition-shadow"
            aria-label="Share on Facebook"
          >
            <Facebook size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('twitter')}
            className="bg-sky-500 p-3 rounded-full text-white shadow-lg hover:shadow-sky-500/50 transition-shadow"
            aria-label="Share on Twitter"
          >
            <Twitter size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('linkedin')}
            className="bg-blue-700 p-3 rounded-full text-white shadow-lg hover:shadow-blue-700/50 transition-shadow"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare('copy')}
            className="bg-gray-700 p-3 rounded-full text-white shadow-lg hover:shadow-gray-700/50 transition-shadow"
            aria-label="Copy link"
          >
            <Link2 size={20} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialShareButtons; 