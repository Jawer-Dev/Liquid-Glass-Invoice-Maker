import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}

const intensityMap = {
  low: 'bg-white/5 border-white/10',
  medium: 'bg-white/10 border-white/20',
  high: 'bg-white/15 border-white/30',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverGlow = true,
  intensity = 'medium',
  noPadding = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25 
      }}
      className={cn(
        'relative rounded-3xl backdrop-blur-[25px]',
        intensityMap[intensity],
        'border shadow-2xl',
        'shadow-black/10',
        !noPadding && 'p-6',
        hoverGlow && 'transition-all duration-300',
        hoverGlow && 'hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]',
        hoverGlow && 'hover:bg-white/20',
        hoverGlow && 'hover:border-white/30',
        className
      )}
    >
      {/* Inner glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)',
        }}
      />
      
      {/* Subtle edge highlight */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
