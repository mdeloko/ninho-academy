import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all active:translate-y-1 transform active:border-b-0 uppercase tracking-widest flex items-center justify-center";
  
  const variants = {
    primary: "bg-brand-yellow text-brand-brown border-b-4 border-brand-darkYellow hover:bg-yellow-300",
    secondary: "bg-white text-brand-brown border-b-4 border-gray-200 hover:bg-gray-50",
    outline: "bg-transparent border-2 border-brand-brown/20 text-brand-brown hover:bg-brand-brown/5",
    danger: "bg-brand-red text-white border-b-4 border-brand-darkRed hover:bg-red-500",
    success: "bg-brand-green text-white border-b-4 border-brand-darkGreen hover:bg-green-500",
  };

  const sizes = {
    sm: "py-2 px-4 text-xs border-b-2",
    md: "py-3 px-6 text-sm",
    lg: "py-4 px-10 text-md",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className} disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};