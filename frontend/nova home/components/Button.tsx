import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  
  const variants = {
    primary: 'bg-brand-brown text-brand-yellow border-b-4 border-black/20 hover:bg-brand-brown/90 active:border-b-0 active:translate-y-1',
    secondary: 'bg-white text-brand-brown border-2 border-brand-brown border-b-4 hover:bg-gray-50 active:border-b-2 active:translate-y-[2px]',
    outline: 'bg-transparent border-2 border-brand-brown text-brand-brown hover:bg-brand-brown/10',
    ghost: 'bg-transparent text-brand-brown hover:bg-brand-brown/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-bold rounded-xl',
    md: 'px-6 py-3 text-base font-extrabold rounded-2xl',
    lg: 'px-8 py-4 text-lg font-extrabold rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};