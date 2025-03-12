'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileText, Video, Sparkles } from 'lucide-react';

export default function GetStartedPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'resume',
      title: 'Resume Enhancer',
      description: 'Improve your resume with AI-powered suggestions and formatting',
      icon: <FileText className="w-10 h-10 text-indigo-600" />,
      href: '/resume-ai',
      color: 'bg-gradient-to-br from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300',
      borderColor: 'border-indigo-300',
      hoverBg: 'from-indigo-200 to-indigo-300',
    },
    {
      id: 'interview',
      title: 'Mock Interview',
      description: 'Practice with AI-powered interviews and get real-time feedback',
      icon: <Video className="w-10 h-10 text-emerald-600" />,
      href: '/mockinterview',
      color: 'bg-gradient-to-br from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300',
      borderColor: 'border-emerald-300',
      hoverBg: 'from-emerald-200 to-emerald-300',
    },
    {
      id: 'analyzer',
      title: 'Career Path Analyzer',
      description: 'Get insights into your ideal career path based on your skills',
      icon: <Sparkles className="w-10 h-10 text-amber-600" />,
      href: '/career-analyzer',
      color: 'bg-gradient-to-br from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300',
      borderColor: 'border-amber-300',
      hoverBg: 'from-amber-200 to-amber-300',
    }
  ];

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            <span className="block">Get Started with</span>
            <span className="block text-indigo-600 dark:text-indigo-400">Hire Flow</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select a tool to begin enhancing your career journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((card) => (
            <Link href={card.href} key={card.id} className="block">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative rounded-xl border ${card.borderColor} overflow-hidden ${card.color} p-6 transition-all duration-300 cursor-pointer h-full`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white bg-opacity-70 shadow-sm">
                      {card.icon}
                    </div>
                    <motion.div
                      animate={{
                        x: hoveredCard === card.id ? 5 : 0,
                        opacity: hoveredCard === card.id ? 1 : 0.7,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <ArrowRight className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 flex-grow">{card.description}</p>
                  
                  <motion.div 
                    className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium flex items-center"
                    animate={{
                      x: hoveredCard === card.id ? 5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    Get Started
                  </motion.div>
                </div>
                
                {/* Decorative elements that animate on hover */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-white opacity-10"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: hoveredCard === card.id ? 1 : 0,
                      opacity: hoveredCard === card.id ? 0.2 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute -left-10 -top-10 w-20 h-20 rounded-full bg-white opacity-10"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: hoveredCard === card.id ? 1 : 0,
                      opacity: hoveredCard === card.id ? 0.15 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Need help deciding where to start? Take our <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">quick assessment</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}