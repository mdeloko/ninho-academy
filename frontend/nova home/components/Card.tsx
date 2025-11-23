import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

export const Card: React.FC<CardProps> = ({ title, description, icon: Icon, color = "bg-white" }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`p-6 rounded-3xl border-2 border-brand-brown/10 shadow-card ${color} flex flex-col items-center text-center h-full`}
    >
      <div className="mb-4 p-4 bg-brand-yellow/20 rounded-2xl text-brand-brown">
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-extrabold mb-2 text-brand-brown">{title}</h3>
      <p className="text-brand-brown/70 font-semibold leading-relaxed">{description}</p>
    </motion.div>
  );
};