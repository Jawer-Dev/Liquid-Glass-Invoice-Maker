import React from 'react';
import { motion } from 'framer-motion';

export const MeshGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e1b4b 75%, #0f172a 100%)',
        }}
      />
      
      {/* Animated mesh orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-20%',
          left: '-10%',
        }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '30%',
          right: '-15%',
        }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 80, 40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '-10%',
          left: '20%',
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -60, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '50%',
          left: '50%',
        }}
        animate={{
          x: [0, -50, 50, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(15,23,42,0.4) 100%)',
        }}
      />
    </div>
  );
};

export default MeshGradient;
