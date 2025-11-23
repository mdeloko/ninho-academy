import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', delay = 0, id }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      className={`py-16 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
};