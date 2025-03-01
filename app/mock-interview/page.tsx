'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Play, 
  CheckCircle, 
  ChevronRight, 
  BarChart, 
  Code, 
  MessageSquare, 
  PenTool, 
  BookOpen,
  Github
} from 'lucide-react';

export default function MockInterviewPage() {
  const router = useRouter();
  type TabType = 'behavioral' | 'technical';
  const [activeTab, setActiveTab] = useState<TabType>('behavioral');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverButton, setHoverButton] = useState<null | 'start'>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to navigate to different interview types
const navigateToInterview = (type: TabType) => {
  console.log(`Navigating to: ${type === 'behavioral' ? '/mock-interview/behaviorial-tab' : '/mock-interview/technical-tab'}`);
  if (type === 'behavioral') {
    router.push('/mock-interview/behaviorial-tab'); // Updated path to match folder name
  } else {
    router.push('/mock-interview/technical-tab'); // Add the parent directory
  }
};

  // Progress data (for demo purposes)
  const progressData = {
    completed: 3,
    total: 10,
    lastSession: 'Technical Interview - Data Structures',
    nextRecommended: 'Behavioral Interview - Leadership',
    improvements: ['Communication clarity', 'Technical depth', 'Example specificity']
  };

  // Tab content definition
  const tabContent = {
    behavioral: {
      title: "Master Behavioral Interviews",
      description: "Practice answering STAR-method questions with real-time AI feedback on your communication, structure, and content.",
      features: [
        "50+ common behavioral questions across different job levels",
        "Feedback on your answer structure and delivery",
        "Industry-specific questions for different roles",
        "Detailed transcripts and improvement suggestions"
      ],
      image: "3d-art/behave-image.webp",
      cta: "Start Behavioral Practice",
    path: "/mock-interview/behaviorial-tab"   
    },
    technical: {
      title: "Ace Technical Interviews",
      description: "Practice coding problems, system design, and technical concepts with interactive coding environments and explanations.",
      features: [
        "Live coding environment with syntax highlighting",
        "Algorithm and data structure challenges",
        "System design interview simulations",
        "Language-specific technical assessments"
      ],
      image: "3d-art/hacker_rank.jpg",
      cta: "Start Technical Practice",
    path: "/mock-interview/technical-tab"
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    pulse: { 
      scale: 1.05,
      transition: { 
        yoyo: Infinity, 
        duration: 1.5,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%", 
                opacity: Math.random() * 0.5 + 0.1 
              }}
              animate={{ 
                y: [
                  Math.random() * 100 + "%", 
                  Math.random() * 100 + "%"
                ],
                opacity: [
                  Math.random() * 0.5 + 0.1,
                  Math.random() * 0.3 + 0.05
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: Math.random() * 20 + 10,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/90 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/get-started" className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold">Hire Flow</span>
            </Link>
            
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="#how-it-works" className="opacity-80 hover:opacity-100 transition">How It Works</Link>
              <Link href="#features" className="opacity-80 hover:opacity-100 transition">Features</Link>
              <Link href="#progress" className="opacity-80 hover:opacity-100 transition">Your Progress</Link>
              
             
            </div>
            
            <button className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="relative py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 md:pr-12 mb-12 md:mb-0"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  variants={fadeIn}
                >
                  Practice Interviews <span className="text-indigo-400">Confidently</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-300 mb-8"
                  variants={fadeIn}
                >
                  Get real-time feedback from our AI interviewer and improve your skills with personalized insights.
                </motion.p>
                
                <motion.div className="flex space-x-4" variants={fadeIn}>
                  <motion.button 
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    variants={pulseAnimation}
                    animate="pulse"
                    onMouseEnter={() => setHoverButton('start')}
                    onMouseLeave={() => setHoverButton(null)}
                    onClick={() => navigateToInterview(activeTab)}
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Interview</span>
                    <motion.div
                      animate={{ x: hoverButton === 'start' ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                  
                  <motion.button 
                    className="border border-indigo-400 text-indigo-400 hover:bg-indigo-900/30 px-6 py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Watch Demo
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="mt-8 flex items-center space-x-2 text-gray-400"
                  variants={fadeIn}
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Join 10,000+ candidates who improved their interview success rate by 73%</span>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="md:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Main 3D illustration placeholder - in a real implementation, you'd use a proper 3D component */}
                <div className="relative">
                  <div className="rounded-lg overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
                    <img src="3d-art/3d_character_207.jpg" alt="AI Interview Session" className="w-full h-auto rounded-lg" />
                  </div>
                  
                  {/* Floating elements around the main image */}
                  <motion.div 
                    className="absolute -top-5 -right-5 bg-indigo-900 rounded-lg p-3 shadow-lg"
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                    }}
                  >
                    <MessageSquare className="w-6 h-6 text-indigo-300" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-5 -left-5 bg-purple-900 rounded-lg p-3 shadow-lg"
                    animate={{ 
                      y: [0, 10, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3.5,
                      delay: 0.5
                    }}
                  >
                    <Code className="w-6 h-6 text-purple-300" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section id="how-it-works" className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our AI-powered platform simulates real interviews to help you prepare and improve
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookOpen className="w-10 h-10 text-indigo-400" />,
                  title: "Choose Your Interview Type",
                  description: "Select from behavioral or technical interviews tailored to your target role and experience level"
                },
                {
                  icon: <PenTool className="w-10 h-10 text-indigo-400" />,
                  title: "Practice With AI Interviewer",
                  description: "Engage in realistic interview sessions with our AI that adapts to your responses and skill level"
                },
                {
                  icon: <BarChart className="w-10 h-10 text-indigo-400" />,
                  title: "Get Detailed Feedback",
                  description: "Receive personalized feedback, performance metrics, and specific improvement suggestions"
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.1)" }}
                >
                  <div className="bg-indigo-900/50 inline-flex rounded-full p-4 mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tabs Section */}
        <section id="features" className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Interview Practice Types</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Customize your practice sessions based on the type of interview you&apos;re preparing for
              </p>
            </motion.div>
            
            {/* Tab navigation */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 rounded-lg bg-gray-800/70 backdrop-blur-sm">
                {['behavioral', 'technical'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`px-6 py-3 rounded-lg font-medium ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tab === 'behavioral' ? 'Behavioral Interview' : 'Technical Interview'}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {tabContent[activeTab].title}
                  </h3>
                  <p className="text-xl text-gray-300 mb-6">
                    {tabContent[activeTab].description}
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    {tabContent[activeTab].features.map((feature, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.button 
                    className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(tabContent[activeTab].path)}
                  >
                    <span>{tabContent[activeTab].cta}</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="relative">
                  {/* Tab-specific image/animation */}
                  <motion.div
                    className="rounded-lg overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/20"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img 
                      src={tabContent[activeTab].image} 
                      alt={activeTab === 'behavioral' ? 'Behavioral Interview' : 'Technical Interview'} 
                      className="w-full h-auto rounded-lg"
                    />
                  </motion.div>
                  
                  {/* Floating decoration elements specific to each tab */}
                  {activeTab === 'behavioral' ? (
                    <>
                      <motion.div 
                        className="absolute -top-6 -right-6 bg-blue-900 rounded-lg p-3 shadow-lg"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                      >
                        <MessageSquare className="w-6 h-6 text-blue-300" />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="absolute -top-6 -right-6 bg-purple-900 rounded-lg p-3 shadow-lg"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                      >
                        <Code className="w-6 h-6 text-purple-300" />
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
        
        {/* Progress tracking section */}
        <section id="progress" className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 mb-8 lg:mb-0 lg:border-r lg:border-gray-700 lg:pr-8">
                  <h3 className="text-2xl font-bold mb-6">Track Your Progress</h3>
                  <p className="text-gray-300 mb-6">Monitor your improvement over time with detailed statistics and personalized recommendations.</p>
                  
                  <div className="bg-gray-900/50 rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Completed Sessions</span>
                      <span className="text-indigo-400 font-bold">{progressData.completed}/{progressData.total}</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-indigo-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(progressData.completed / progressData.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <Link href="/mock-interview/history">
                    <button className="text-indigo-400 hover:text-indigo-300 transition flex items-center">
                      <span>View detailed history</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </Link>
                </div>
                
                <div className="lg:w-2/3 lg:pl-8">
                  <h4 className="text-xl font-semibold mb-4">Interview Insights</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-gray-400 mb-2">Last Completed</h5>
                      <p className="font-medium">{progressData.lastSession}</p>
                    </div>
                    
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <h5 className="text-gray-400 mb-2">Recommended Next</h5>
                      <p className="font-medium">{progressData.nextRecommended}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <h5 className="text-gray-400 mb-2">Areas for Improvement</h5>
                    <ul className="space-y-2">
                      {progressData.improvements.map((item, index) => (
                        <motion.li 
                          key={index} 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl p-12 text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              </div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 relative z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              >
                Ready to Ace Your Next Interview?
              </motion.h2>
              
              <p className="text-xl mb-8 max-w-2xl mx-auto relative z-10">
                Start practicing today and build the confidence you need to succeed in your interviews.
              </p>
              
              <motion.button 
                className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg shadow-lg relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(tabContent[activeTab].path)}
              >
                Start Your First Interview
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold">Hire Flow</span>
              </div>
              <p className="text-gray-400">
                AI-powered interview practice to help you land your dream job.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/interviews/behavioral" className="hover:text-white transition">Behavioral Interviews</Link></li>
                <li><Link href="/interviews/technical" className="hover:text-white transition">Technical Interviews</Link></li>
                <li><Link href="#" className="hover:text-white transition">Progress Tracking</Link></li>
                <li><Link href="#" className="hover:text-white transition">Feedback Analysis</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Interview Tips</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Career Resources</Link></li>
                <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">&copy; 2025 Hire Flow. All rights reserved.</p>
            
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}