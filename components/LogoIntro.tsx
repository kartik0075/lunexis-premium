
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LogoIntro() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2, delay: 1 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1.2, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, duration: 2 }}
      >
        <Image src="/lunexis-logo.png" alt="Lunexis Logo" width={160} height={160} />
      </motion.div>
    </motion.div>
  );
}
